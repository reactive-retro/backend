
import _ from 'lodash';
import dbPromise from '../../objects/db';
import Logger from '../../objects/logger';

import getPlayer from './getbyname';
import loadBattle from '../../combat/functions/loadbattle';
import loadParty from '../../party/functions/loadparty';

export default async (name, scWorker) => {

    const db = await dbPromise();
    const players = db.collection('players');

    let player = null;

    try {
        player = await getPlayer(name);
    } catch(e) {
        return;
    }

    if(player.battleId) {
        const battle = await loadBattle(player.battleId);
        _.pull(battle.players, name);

        if(battle.players.length > 0) {
            battle.setReadyToProcess();
            if(battle.isReadyToProcess) {
                try {
                    const actions = battle.processActions();
                    scWorker.exchange.publish(`battle:${battle._id}:results`, { battle: battle.transmitObject(), actions, isDone: battle.isDone });
                } catch(e) {
                    Logger.error('Combat:PlayerLogout', e);
                }
            } else {
                scWorker.exchange.publish(`battle:${battle._id}:updates`, { battle: battle.transmitObject() });
            }
        }

        battle.save();
    }

    if(player.partyId) {
        const party = await loadParty(player.partyId);
        party.playerLeave(player);

        party.notifyOfUpdates(scWorker);
        party.save();
    }

    // set the player to offline, and remove all status effects/buffs/cooldowns
    players.updateOne({ name: name }, { $set: {
        online: false,
        partyId: null,
        battleId: null,
        location: null,
        statusEffects: [],
        'equipment.buffs.stats': {},
        cooldowns: {} } }, _.noop);

};