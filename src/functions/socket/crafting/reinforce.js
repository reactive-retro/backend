
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

        let item = _.find(player.inventory, { itemId });

        if(!item) {
            if(player.equipment.weapon.itemId === itemId) item = player.equipment.weapon;
            if(player.equipment.armor.itemId === itemId)  item = player.equipment.armor;
        }

        if(!item || !_.contains(['weapon', 'armor'], item.type)) {
            return respond({ msg: MESSAGES.ITEM_NONEXISTENT });
        }

        if(!item.canMod()) {
            return respond({ msg: MESSAGES.NOT_MODDABLE });
        }

        const material = _.find(player.inventory, { itemId: materialId });
        if(!material || material.type !== 'material') {
            return respond({ msg: MESSAGES.ITEM_NONEXISTENT });
        }

        if(!player.canInteractWith(place.location)) {
            return respond({ msg: MESSAGES.TOO_FAR_AWAY });
        }

        if(player.gold < item.calcModCost(material)) {
            return respond({ msg: MESSAGES.NOT_ENOUGH_GOLD });
        }

        player.addGold(-item.calcModCost(material));

        player.reinforceItem(item, material);
        player.save();

        updatePlayer(socket, player);

        respond({ msg: MESSAGES.SUCCESSFUL_REINFORCE });
    };

    socket.on('player:craft:reinforce', reinforceItem);
};