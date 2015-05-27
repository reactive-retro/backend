
var MESSAGES = require('../static/messages');
var _ = require('lodash');

var validateNewPlayer = function(credentials) {
    //no name is a bad name
    if(!credentials.name) return MESSAGES.INVALID_NAME;

    credentials.name = credentials.name.trim();
    if(credentials.name.length > 20) return MESSAGES.NAME_TOO_LONG;
    if(credentials.name.length < 2)  return MESSAGES.NAME_TOO_SHORT;
};

var buildPlayerObject = function(object) {
    return _.omit(object, '_id');
};

module.exports = function(socket, db) {
    socket.on('login', function(credentials, respond) {
        var search = _.pick(credentials, ['facebookId']);
        if(_.size(search) === 0) {
            respond(MESSAGES.NO_IDENT);
            return;
        }

        //TODO save player, migrate player (ie, add data that doesn't exist where needed, like weapons)
        //TODO also strip out bad data from the player object before sending to client
        //TODO also have a create player function (tied to migrate above)

        db.players.findOne(search).then(function(doc) {

            //login
            if(doc) {
                socket.setAuthToken({heroname: credentials.name});
                respond(null, {msg: MESSAGES.LOGIN_SUCCESS, player: buildPlayerObject(doc)});

            } else {

                //validate the player before creating it
                var message = validateNewPlayer(credentials);
                if(message) {
                    respond({msg: message});
                    return;
                }

                //try to create the player
                db.players.insert(credentials, function(err, doc) {

                    //the only failure will probably be a duplicate name
                    if(err) {
                        respond({msg: MESSAGES.NAME_TAKEN});

                    //created successfully
                    } else {
                        socket.setAuthToken({heroname: credentials.name});
                        respond(null, {msg: MESSAGES.CREATE_SUCCESS, player: buildPlayerObject(doc)});
                    }
                });
            }
        });
    });
};