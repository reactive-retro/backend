
import _ from 'lodash';
import dbPromise from '../../objects/db';

export default (player) => {
    player = _.omit(player, '_id');
    dbPromise().then(db => {
        const players = db.collection('players');
        players.update({name: player.name}, player, _.noop);
    });
};