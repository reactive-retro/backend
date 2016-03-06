
import _ from 'lodash';
import dbPromise from '../../objects/db';

import Party from '../Party';

export default async (partyId) => {
    const db = await dbPromise();
    const parties = db.collection('parties');

    return new Promise((resolve, reject) => {
        parties.findOne({ _id: partyId }, async (err, doc) => {
            if(err) return reject(err);
            if(!doc) return reject();

            const party = new Party(doc);
            await party.isReady;
            resolve(party);
        });
    });
};