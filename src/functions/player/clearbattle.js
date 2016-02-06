
import _ from 'lodash';
import dbPromise from '../../objects/db';

export default (name) => {
    dbPromise().then(db => {
        var players = db.collection('players');
        players.updateOne({ name: name }, { $set: { battleId: null } }, _.noop);
    });
};