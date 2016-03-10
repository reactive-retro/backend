
import _ from 'lodash';

import getPlayer from '../../../character/functions/getbyname';
import { verify as monsterVerify } from '../../../objects/monstergenerator';
import MESSAGES from '../../../static/messages';
import createBattle from '../../../combat/functions/createbattle';
import loadParty from '../../../party/functions/loadparty';

export default (socket, scWorker) => {

    const enterCombat = async ({ name, monsters }, respond) => {

        const verified = _.map(monsters, monsterVerify);
        if(_.any(verified, bool => !bool)) {
            return respond({ msg: MESSAGES.BAD_MONSTER });
        }

        if(!name) {
            return respond({ msg: MESSAGES.NO_NAME });
        }

        let player = null;

        try {
            player = await getPlayer(name);
        } catch(e) {
            return respond({ msg: e.msg });
        }

        if(player.battleId) {
            return respond({ msg: MESSAGES.ALREADY_IN_COMBAT });
        }

        if(player.hasTakenAction('monster', monsters[0].id)) {
            return respond({ msg: MESSAGES.MONSTER_ALREADY_DEAD });
        }

        let players = [player];
        let party = null;

        if(player.partyId) {
            try {
                party = await loadParty(player.partyId);
            } catch(e) {
                return respond({ msg: MESSAGES.INVALID_PARTY });
            }
            await party.isReady;
            players = party.playerData;
        }

        let battle = null;

        try {
            battle = await createBattle({ players, monsters });
        } catch(e) {
            return respond({ msg: MESSAGES.BAD_COMBAT });
        }

        if(player.partyId && party) {
            party.notifyOfCombat(scWorker, battle);
        } else {
            socket.emit('combat:entered', battle.transmitObject());
        }

        respond({ msg: MESSAGES.BATTLE_ENTERED });
    };

    socket.on('combat:enter', enterCombat);
};