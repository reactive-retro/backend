
import dbPromise from '../../objects/db';

export default async (playerLevel) => {
    const db = await dbPromise();
    const monsters = db.collection('monsters');

    return new Promise((resolve, reject) => {
        monsters.find({
            minLevel: { $lte: playerLevel },
            maxLevel: { $gte: playerLevel }
        }).toArray((err, validMonsters) => {
            if(err) return reject(err);

            if(!validMonsters.length) return reject(new Error(`No monsters to spawn at level ${playerLevel}.`));

            resolve(validMonsters);
        });
    });
};