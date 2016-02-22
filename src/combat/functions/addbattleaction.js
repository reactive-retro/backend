
import _ from 'lodash';

import Battle from './../base/Battle';
import dbPromise from '../../objects/db';

export default async (battleId, action) => {
    const db = await dbPromise();
    const battles = db.collection('battles');

    return new Promise((resolve, reject) => {

        const setter = { $set: {} };
        setter.$set[`actions.${action.name}`] = action;

        battles.updateOne({ _id: battleId }, setter, (err) => {
            if(err) return reject(err);

            battles.findOne({ _id: battleId }, async (err, doc) => {
                if (err) return reject(err);

                const battle = new Battle(doc);

                await battle.isReady;
                battle.isReadyToProcess = _.all(battle.players, player => battle.actions[player]);
                resolve(battle);
            });
        });
    });
};