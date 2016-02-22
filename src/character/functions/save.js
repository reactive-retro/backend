
import _ from 'lodash';
import dbPromise from '../../objects/db';

export default async (player) => {
    const db = await dbPromise();
    player = _.omit(player, ['_id', 'needsMonsterRefresh']);
    const players = db.collection('players');
    return players.updateOne({name: player.name}, player);
};