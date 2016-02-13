
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import atob from 'atob';

import dbPromise from '../../objects/db';
import MESSAGES from '../../static/messages';

import Player from '../../character/base/Player';
import SkillManager from '../../objects/skillmanager';

import nearbyplaces from '../world/nearbyplaces';
import nearbymonsters from '../world/nearbymonsters';

import SETTINGS from '../../static/settings';

const AUTH0_SECRET = process.env.AUTH0_SECRET;

const validateNewPlayer = (credentials) => {
    //no name is a bad name
    if(!credentials.name) return MESSAGES.INVALID_NAME;

    credentials.name = credentials.name.trim();
    if(credentials.name.length > 20) return MESSAGES.NAME_TOO_LONG;
    if(credentials.name.length < 2)  return MESSAGES.NAME_TOO_SHORT;

    if(!credentials.homepoint || !credentials.homepoint.lat || !credentials.homepoint.lon) return MESSAGES.NO_HOMEPOINT;
};

const buildPlayerObject = (object) => {
    const player = new Player(object);
    player._id = undefined;
    return player;
};

const respondWithPlayer = (socket, respond, msg, token, player) => {

    nearbyplaces(player.homepoint).then(places => {
        socket.emit('update:places', places);
    });

    const monsters = nearbymonsters(player.homepoint);

    socket.setAuthToken({heroname: player.name, token: token});

    socket.emit('update:monsters', monsters);

    const playerInst = buildPlayerObject(player);

    playerInst.battleId = null;
    playerInst.cooldowns = {};
    playerInst.statusEffects = [];
    playerInst.equipment.buffs.stats = {};
    playerInst.fullheal();
    playerInst.save();

    socket.emit('update:player', playerInst);
    socket.emit('update:skills', SkillManager.getSkills(playerInst));

    respond(null, { msg, settings: SETTINGS });
};

export default (socket) => {

    // expect {name, profession, homepoint, userId, token}
    socket.on('login', (credentials, respond) => {

        const { name, profession, homepoint, userId, token } = credentials;

        if(!userId || !token) {
            respond({msg: MESSAGES.NO_IDENT});
            return;
        }

        if(AUTH0_SECRET) {
            try {
                jwt.verify(token, atob(AUTH0_SECRET), { algorithms: ['HS256'] });
            } catch(e) {
                console.error(credentials, e, e.stack);
                return respond({msg: MESSAGES.INVALID_TOKEN});
            }
        }

        dbPromise().then(db => {

            var players = db.collection('players');

            players.findOne({userId: userId}, (err, doc) => {

                if(err) {
                    console.error(err);
                    return respond({msg: MESSAGES.GENERIC});
                }

                //login
                if (doc) {
                    respondWithPlayer(socket, respond, MESSAGES.LOGIN_SUCCESS, token, doc);

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
                    players.insert(credentialClone, {w:1}, (err) => {

                        //the only failure will probably be a duplicate name
                        if (err) {
                            respond({msg: MESSAGES.NAME_TAKEN});

                            //created successfully
                        } else {
                            respondWithPlayer(socket, respond, MESSAGES.CREATE_SUCCESS, credentials.token, credentialClone);
                        }
                    });
                }
            });
        });
    });
};