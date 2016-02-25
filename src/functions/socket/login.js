
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

import updatePlayer from '../updaters/player';

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
    return new Player(object);
};

const respondWithPlayer = async (socket, respond, msg, token, player) => {

    socket.setAuthToken({heroname: player.name, token: token});

    const playerInst = buildPlayerObject(player);

    playerInst.clearDataOnLogin();

    updatePlayer(socket, playerInst);

    respond(null, { msg, settings: SETTINGS });

    socket.emit('update:options', playerInst.options);
    socket.emit('update:skills', SkillManager.getSkills(playerInst));

    const places = await nearbyplaces(player.homepoint);
    socket.emit('update:places', places);
};

export default (socket) => {

    // expect {name, profession, homepoint, userId, token}
    socket.on('login', async (credentials, respond) => {

        const { userId, token } = credentials;

        if(!userId || !token) {
            return respond({msg: MESSAGES.NO_IDENT});
        }

        if(AUTH0_SECRET) {
            try {
                jwt.verify(token, atob(AUTH0_SECRET), { algorithms: ['HS256'] });
            } catch(e) {
                console.error(credentials, e, e.stack);
                return respond({msg: MESSAGES.INVALID_TOKEN});
            }
        }

        const db = await dbPromise();

        const players = db.collection('players');

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
                    return respond({msg: message});
                }

                //token doesn't need to be on the object
                const credentialClone = _.clone(credentials);
                credentialClone.token = null;

                //try to create the player
                players.insertOne(credentialClone, (err) => {

                    //the only failure will probably be a duplicate name
                    if (err) {
                        return respond({msg: MESSAGES.NAME_TAKEN});
                    }

                    //created successfully
                    respondWithPlayer(socket, respond, MESSAGES.CREATE_SUCCESS, credentials.token, credentialClone);
                });
            }
        });
    });
};