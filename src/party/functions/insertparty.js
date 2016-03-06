
import _ from 'lodash';
import dbPromise from '../../objects/db';

import Party from '../Party';

export default async ({ players }) => {
    const db = await dbPromise();

    const parties = db.collection('parties');

    return new Promise((resolve, reject) => {
        const newParty = new Party({ players: _.pluck(players, 'name') });
        const insertParty = newParty.saveObject();

        parties.insertOne(insertParty, async (err) => {
            if (err) {
                return reject(err);
            }

            const playerSaves = _.map(players, player => {
                player.partyId = newParty._id;
                return player.save();
            });

            await Promise.all(playerSaves);
            await newParty.isReady;
            resolve(newParty);
        });
    });
};