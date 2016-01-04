
import _ from 'lodash';

import dbPromise from '../../objects/db';
import MESSAGES from '../../static/messages';
import save from '../save';
import calculate from '../calculate';
import migrate from '../migrate';
import fullheal from '../fullheal';

const validateNewPlayer = (credentials) => {
    //no name is a bad name
    if(!credentials.name) return MESSAGES.INVALID_NAME;

    credentials.name = credentials.name.trim();
    if(credentials.name.length > 20) return MESSAGES.NAME_TOO_LONG;
    if(credentials.name.length < 2)  return MESSAGES.NAME_TOO_SHORT;

    if(!credentials.homepoint || !credentials.homepoint.lat || !credentials.homepoint.lon) return MESSAGES.NO_HOMEPOINT;
};

const buildPlayerObject = (object) => calculate(migrate(_.omit(object, '_id')));

export default (socket) => {

    // expect {name, profession, facebookId?, googleId?, twitterId?, redditId?}
    socket.on('login', (credentials, respond) => {
        var authSource = credentials.authsource;
        var search = _.pick(credentials, [authSource+'Id']);
        if(_.size(search) === 0) {
            respond({msg: MESSAGES.NO_IDENT});
            return;
        }

        // remove bad keys like $default and remove bad object values just in case something leaks through
        // also, no need to keep tokens around
        credentials = _.omit(credentials, (val, key) => {
            return _.startsWith(key, '$')
                || _.isEmpty(val)
                || _.contains(key, 'Token');
        });

        dbPromise().then(db => {

            var players = db.collection('players');

            players.findOne(search, (err, doc) => {

                if(err) {
                    return respond({msg: MESSAGES.GENERIC});
                }

                //login
                if (doc) {
                    respond(null, {msg: MESSAGES.LOGIN_SUCCESS, player: fullheal(buildPlayerObject(doc))});
                    socket.setAuthToken({heroname: credentials.name});

                } else {
                    //validate the player before creating it
                    var message = validateNewPlayer(credentials);
                    if (message) {
                        respond({msg: message});
                        return;
                    }

                    //try to create the player
                    players.insert(credentials, {w:1}, (err, docs) => {

                        var newPlayer = docs.ops[0];

                        //the only failure will probably be a duplicate name
                        if (err) {
                            respond({msg: MESSAGES.NAME_TAKEN});

                            //created successfully
                        } else {
                            socket.setAuthToken({heroname: credentials.name});
                            respond(null, {msg: MESSAGES.CREATE_SUCCESS, player: fullheal(buildPlayerObject(newPlayer))});
                        }
                    });
                }
            });
        });
    });
};