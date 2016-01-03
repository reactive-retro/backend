
var MESSAGES = require('../../static/messages');
var _ = require('lodash');
var migrate = require('./../migrate');
var calculate = require('./../calculate');
var fullheal = require('./../fullheal');

var dbPromise = require('../../objects/db');

var validateNewPlayer = function(credentials) {
    //no name is a bad name
    if(!credentials.name) return MESSAGES.INVALID_NAME;

    credentials.name = credentials.name.trim();
    if(credentials.name.length > 20) return MESSAGES.NAME_TOO_LONG;
    if(credentials.name.length < 2)  return MESSAGES.NAME_TOO_SHORT;

    if(!credentials.homepoint || !credentials.homepoint.lat || !credentials.homepoint.lon) return MESSAGES.NO_HOMEPOINT;
};

var buildPlayerObject = function(object) {
    return calculate(migrate(_.omit(object, '_id')));
};

module.exports = function(socket) {

    // expect {name, profession, facebookId?, googleId?, twitterId?, redditId?}
    socket.on('login', function(credentials, respond) {
        var search = _.pick(credentials, ['facebookId', 'googleId']);
        if(_.size(search) === 0) {
            respond({msg: MESSAGES.NO_IDENT});
            return;
        }

        // remove bad keys like $default and remove bad object values just in case something leaks through
        // also, no need to keep tokens around
        credentials = _.omit(credentials, function(val, key) {
            return _.startsWith(key, '$') || _.isEmpty(val) || _.contains(key, 'Token');
        });

        dbPromise().then(function(db) {

            var players = db.collection('players');

            players.findOne(search, function(err, doc) {

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
                    players.insert(credentials, {w:1}, function (err, docs) {

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