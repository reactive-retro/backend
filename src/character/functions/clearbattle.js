
import _ from 'lodash';
import dbPromise from '../../objects/db';

export default async (name) => {

    const db = await dbPromise();
    const players = db.collection('players');
    const battles = db.collection('battles');

    players.updateOne({ name: name }, { $set: {
        battleId: null,
        statusEffects: [],
        'equipment.buffs.stats': {},
        cooldowns: {} } }, _.noop);

    // clear EVERY battle that ONLY has this player present
    // there will need to be more done for party battles
    battles.deleteMany({ players: { $size: 1, $in: [name] } }, _.noop);
};