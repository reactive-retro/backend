
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import atob from 'atob';

import dbPromise from '../../objects/db';
import MESSAGES from '../../static/messages';
import save from '../player/save';
import calculate from '../player/calculate';
import migrate from '../player/migrate';
import fullheal from '../player/fullheal';

const AUTH0_SECRET = process.env.AUTH0_SECRET;

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

    // expect {name, profession, homepoint, userId, token}
    socket.on('login', (credentials, respond) => {
        if(!credentials.userId || !credentials.token) {
            respond({msg: MESSAGES.NO_IDENT});
            return;
        }

        if(AUTH0_SECRET) {
            try {
                jwt.verify(credentials.token, atob(AUTH0_SECRET), { algorithms: ['HS256'] });
            } catch(e) {
                console.error(credentials, e, e.stack);
                return respond({msg: MESSAGES.INVALID_TOKEN});
            }
        }

        dbPromise().then(db => {

            var players = db.collection('players');

            players.findOne({userId: credentials.userId}, (err, doc) => {

                if(err) {
                    console.error(err);
                    return respond({msg: MESSAGES.GENERIC});
                }

                //login
                if (doc) {
                    respond(null, {msg: MESSAGES.LOGIN_SUCCESS, player: fullheal(buildPlayerObject(doc))});
                    socket.setAuthToken({heroname: doc.name, token: credentials.token});

                } else {
                    //validate the player before creating it
                    var message = validateNewPlayer(credentials);
                    if (message) {
                        respond({msg: message});
                        return;
                    }

                    //token doesn't need to be on the object
                    const credentialClone = _.clone(credentials);
                    credentialClone.token = null;

                    //try to create the player
                    players.insert(credentialClone, {w:1}, (err, docs) => {

                        var newPlayer = docs.ops[0];

                        //the only failure will probably be a duplicate name
                        if (err) {
                            respond({msg: MESSAGES.NAME_TAKEN});

                            //created successfully
                        } else {
                            socket.setAuthToken({heroname: credentials.name, token: credentials.token});
                            respond(null, {msg: MESSAGES.CREATE_SUCCESS, player: fullheal(buildPlayerObject(newPlayer))});
                        }
                    });
                }
            });
        });
    });
};