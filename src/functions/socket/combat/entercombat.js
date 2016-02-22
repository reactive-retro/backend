
import _ from 'lodash';

import getPlayer from '../../../character/functions/getbyname';
import { verify as monsterVerify } from '../../../objects/monstergenerator';
import MESSAGES from '../../../static/messages';
import createBattle from '../../../combat/functions/createbattle';

export default (socket) => {

    const enterCombat = async ({ name, monsters }, respond) => {

        const verified = _.map(monsters, monsterVerify);
        if(_.any(verified, bool => !bool)) {
            return respond({ msg: MESSAGES.BAD_MONSTER });
        }

        if(!name) {
            return respond({msg: MESSAGES.NO_NAME});
        }

        let player = null;

        try {
            player = await getPlayer(name);
        } catch(e) {
            return respond({msg: e.msg});
        }

        if(player.battleId) {
            return respond({msg: MESSAGES.ALREADY_IN_COMBAT});
        }

        const party = [player];

        let battle = null;

        try {
            battle = await createBattle({ players: party, monsters});
        } catch(e) {
            return respond({msg: MESSAGES.BAD_COMBAT});
        }

        socket.emit('combat:entered', battle.transmitObject());

        respond({msg: MESSAGES.BATTLE_ENTERED});
    };

    socket.on('combat:enter', enterCombat);
};