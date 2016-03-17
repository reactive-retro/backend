
import _ from 'lodash';

import dbPromise from '../../objects/db';
import Battle from './../base/Battle';

export default async ({ players, monsters }) => {
    const db = await dbPromise();

    return new Promise((resolve, reject) => {

        const battles = db.collection('battles');
        const newBattle = new Battle({ players: _.pluck(players, 'name'), monsters });

        const insertBattle = newBattle.saveObject();

        battles.insertOne(insertBattle, async (err, res) => {
            if (err) {
                return reject(err);
            }

            newBattle._id = res.insertedId;

            const playerSaves = _.map(players, player => {
                player.battleId = res.insertedId;
                player.itemUses = _.countBy(player.items);
                return player.selectiveSave(['battleId', 'itemUses']);
            });

            newBattle.playerData = await Promise.all(playerSaves);
            await newBattle.isReady;
            resolve(newBattle);
        });
    });
};