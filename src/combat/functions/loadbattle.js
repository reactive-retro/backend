
import Battle from './../base/Battle';
import dbPromise from '../../objects/db';

export default async (battleId) => {
    const db = await dbPromise();
    const battles = db.collection('battles');

    return new Promise((resolve, reject) => {
        battles.findOne({ _id: battleId }, async (err, doc) => {
            if(err) return reject(err);
            if(!doc) return reject();

            const battle = new Battle(doc);

            await battle.isReady;
            resolve(battle);
        });
    });
};