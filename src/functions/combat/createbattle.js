
import q from 'q';

import dbPromise from '../../objects/db';

class BattleData {
    constructor(players, monsters) {
        this.players = players;
        this.monsters = monsters;
    }
}

export default ({ players, monsters }) => {
    return dbPromise().then(db => {

        const battles = db.collection('battles');
        const newBattle = new BattleData(players, monsters);
        const defer = q.defer();

        battles.insert(newBattle, {w:1}, (err) => {
            if (err) {
               return defer.reject();
            }

            defer.resolve(newBattle);
        });

        return defer.promise;
    });
};