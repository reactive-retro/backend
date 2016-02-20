
import dbPromise from '../../objects/db';
import MESSAGES from '../../static/messages';

import Player from '../base/Player';

export default async (name, respond = () => {}) => {

    return new Promise((resolve, reject) => {
        dbPromise().then(db => {
            var players = db.collection('players');
            players.findOne({name: name}, (err, doc) => {

                if (err) {
                    reject(err);
                    return respond({msg: MESSAGES.GENERIC});
                }

                if (!doc) {
                    reject(err);
                    return respond({msg: MESSAGES.NO_PLAYER});
                }

                resolve(new Player(doc));
            })
        });
    });
};