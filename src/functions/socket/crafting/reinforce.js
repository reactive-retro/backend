
import _ from 'lodash';

import getPlayer from '../../../character/functions/getbyname';
import { verify as placeVerify } from '../../../objects/placegenerator';
import MESSAGES from '../../../static/messages';
import updatePlayer from '../../updaters/player';

export default (socket) => {

    const reinforceItem = async ({ name, place, itemId, materialId }, respond) => {

        if(!name) {
            return respond({ msg: MESSAGES.NO_NAME });
        }

        if(!_.contains(place.derivedType, 'Crafting Station')) {
            return respond({ msg: MESSAGES.NOT_A_CRAFTING_STATION });
        }

        if(!placeVerify(place)) {
            return respond({ msg: MESSAGES.BAD_PLACE });
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

        const item = _.find(player.inventory, { itemId });

        /*
        if(!item) {
            item = player.equipment.weapon.itemId === itemId ? player.equipment.weapon : item;
            item = player.equipment.armor.itemId === itemId ? player.equipment.armor : item;
        }
        */

        if(!item || !_.contains(['weapon', 'armor'], item.type)) {
            return respond({ msg: MESSAGES.ITEM_NONEXISTENT });
        }

        if(!item.canMod()) {
            return respond({ msg: MESSAGES.NOT_MODDABLE });
        }

        const material = _.find(player.inventory, { itemId: materialId });
        if(!material || item.type !== 'material') {
            return respond({ msg: MESSAGES.ITEM_NONEXISTENT });
        }

        if(!player.canInteractWith(place.location)) {
            return respond({ msg: MESSAGES.TOO_FAR_AWAY });
        }

        /*

        TODO cost?
        if(player.gold < item.value) {
            return respond({ msg: MESSAGES.NOT_ENOUGH_GOLD });
        }

        player.addGold(-item.value);
        */
        player.reinforceItem(item, material);
        player.save();

        updatePlayer(socket, player);

        respond({ msg: MESSAGES.SUCCESSFUL_REINFORCE });
    };

    socket.on('craft:reinforce', reinforceItem);
};