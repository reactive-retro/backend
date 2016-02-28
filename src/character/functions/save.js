
import _ from 'lodash';
import dbPromise from '../../objects/db';

export default async (player) => {
    const db = await dbPromise();
    player = _.omit(player, ['_id', 'needsMonsterRefresh']);
    const players = db.collection('players');
    return players.updateOne({name: player.name}, player);
};

export const selectiveSave = async (player, keys) => {
    const db = await dbPromise();
    const players = db.collection('players');
    const setter = { $set: _.pick(player, keys) };
    return players.updateOne({name: player.name}, setter);
};