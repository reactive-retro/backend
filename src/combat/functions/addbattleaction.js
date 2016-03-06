
import _ from 'lodash';

import loadBattle from './loadbattle';
import dbPromise from '../../objects/db';

export default async (battleId, action) => {
    const db = await dbPromise();
    const battles = db.collection('battles');

    return new Promise((resolve, reject) => {

        const setter = { $set: {} };
        setter.$set[`actions.${action.name}`] = action;

        battles.updateOne({ _id: battleId }, setter, async (err) => {
            if(err) return reject(err);

            resolve(await loadBattle(battleId));
        });
    });
};