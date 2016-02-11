
import q from 'q';
import _ from 'lodash';

import dbPromise from '../../objects/db';
import Battle from './../base/Battle';

export default ({ players, monsters }) => {
    return dbPromise().then(db => {

        const battles = db.collection('battles');
        const newBattle = new Battle({players, monsters});
        const defer = q.defer();

        const insertBattle = newBattle.saveObject();

        battles.insert(insertBattle, {w:1}, (err) => {
            if (err) {
                return defer.reject(err);
            }

            newBattle._id = insertBattle._id;
            newBattle.isReady.then(() => defer.resolve(newBattle));
        });

        return defer.promise;
    }).catch(console.error);
};