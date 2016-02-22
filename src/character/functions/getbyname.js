
import dbPromise from '../../objects/db';
import MESSAGES from '../../static/messages';

import Player from '../base/Player';

export default async (name) => {
    const db = await dbPromise();
    const players = db.collection('players');

    return new Promise((resolve, reject) => {
        players.findOne({name: name}, (err, doc) => {

            if (err) {
                return reject({ err, msg: MESSAGES.GENERIC });
            }

            if (!doc) {
                return reject({ err, msg: MESSAGES.NO_PLAYER });
            }

            resolve(new Player(doc));
        });
    });
};