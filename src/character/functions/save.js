
import _ from 'lodash';
import dbPromise from '../../objects/db';

export default async (player) => {
    const db = await dbPromise();
    player = _.omit(player, ['_id', 'needsMonsterRefresh', 'sendPlaces', 'canChangeHomepoint']);
    const players = db.collection('players');

    return new Promise(resolve => {
        players.updateOne({ name: player.name }, player, () => resolve(player));
    });
};

export const selectiveSave = async (player, keys) => {
    const db = await dbPromise();
    const players = db.collection('players');
    const setter = { $set: _.pick(player, keys) };

    return new Promise(resolve => {
        players.updateOne({ name: player.name }, setter, () => resolve(player));
    });
};