
import _ from 'lodash';
import dbPromise from '../objects/db';

export default (player) => {
    dbPromise().then(db => {
        const players = db.collection('players');
        players.update({name: player.name}, player, _.noop);
    });
};