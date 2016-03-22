
import _ from 'lodash';

import getPlayer from '../../../character/functions/getbyname';
import MESSAGES from '../../../static/messages';

import TraitManager from '../../../objects/traitmanager';
import updatePlayer from '../../updaters/player';

// 6 skill slots
const MIN_SLOT = 0;
const MAX_SLOT = 5;

export default (socket) => {

    const traitChange = async ({ name, traitName, traitSlot }, respond) => {

        if(!socket.getAuthToken()) {
            return respond({ msg: MESSAGES.INVALID_TOKEN });
        }

        if(!name) {
            return respond({ msg: MESSAGES.NO_NAME });
        }

        if(traitName !== null && !TraitManager.doesTraitExist(traitName)) {
            return respond({ msg: MESSAGES.NO_TRAIT });
        }

        if(TraitManager.isTraitDisabled(traitName)) {
            return respond({ msg: MESSAGES.TRAIT_DISABLED });
        }

        if(!_.isNumber(traitSlot) || traitSlot < MIN_SLOT || traitSlot > MAX_SLOT || traitSlot % 1 !== 0) {
            return respond({ msg: MESSAGES.BAD_SLOT });
        }

        let player = null;

        try {
            player = await getPlayer(name);
        } catch(e) {
            return respond({ msg: e.msg });
        }

        if(player.battleId) {
            return respond({ msg: MESSAGES.CURRENTLY_IN_COMBAT });
        }

        if(traitName !== null && _.contains(player.traits, traitName)) {
            return respond({ msg: MESSAGES.TRAIT_ALREADY_ASSIGNED });
        }
        
        player.traits[traitSlot] = traitName || undefined;
        player.calculate();
        player.save();

        updatePlayer(socket, player);

        respond(null, { msg: MESSAGES.TRAIT_CHANGE_SUCCESS });

    };

    socket.on('player:change:trait', traitChange);
};