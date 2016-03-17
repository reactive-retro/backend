
import _ from 'lodash';

import getPlayer from '../../../character/functions/getbyname';
import MESSAGES from '../../../static/messages';
import updatePlayer from '../../updaters/player';

export default (socket) => {

    const changeitem = async ({ name, itemId, itemSlot }, respond) => {

        if(!socket.getAuthToken()) {
            return respond({ msg: MESSAGES.INVALID_TOKEN });
        }

        if(!name) {
            return respond({ msg: MESSAGES.NO_NAME });
        }

        if(!itemId && itemId !== null) {
            return respond({ msg: MESSAGES.NO_ITEM });
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


        if(itemId) {
            const item = _.findWhere(player.inventory, { itemId: itemId });

            if(!item || item.type !== 'consumable') {
                return respond({ msg: MESSAGES.BAD_ITEM });
            }

            if(item.levelRequirement > player.currentLevel) {
                return respond({ msg: MESSAGES.TOO_LOW_LEVEL });
            }

            if(!player.canSlotItem(item)) {
                return respond({ msg: MESSAGES.NOT_ENOUGH_OF_ITEM });
            }

            player.slotItem(item, itemSlot);

        } else {
            player.slotItem(null, itemSlot);
        }

        player.save();

        updatePlayer(socket, player);

        respond(null, { msg: MESSAGES.ITEM_CHANGE_SUCCESS });

    };

    socket.on('player:change:item', changeitem);
};