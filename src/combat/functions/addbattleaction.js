
import q from 'q';
import _ from 'lodash';

import Battle from './../base/Battle';
import dbPromise from '../../objects/db';

export default (battleId, action) => {
    return dbPromise().then(db => {

        const battles = db.collection('battles');
        const defer = q.defer();

        const setter = { $set: {} };
        setter.$set[`actions.${action.name}`] = action;

        battles.updateOne({ _id: battleId }, setter, () => {

            battles.findOne({ _id: battleId }, (err, doc) => {
                if (err) {
                    return defer.reject(err);
                }

                const battle = new Battle(doc);
                battle.isReady.then(() => {
                    battle.isReadyToProcess = _.all(battle.players, player => battle.actions[player]);
                    defer.resolve(battle);
                });
            });
        });

        return defer.promise;
    });
};