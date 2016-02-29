
import _ from 'lodash';

import getPlayer from '../../../character/functions/getbyname';
import MESSAGES from '../../../static/messages';
import updatePlayer from '../../updaters/player';

export default (socket) => {

    const equip = async ({ name, itemId }, respond) => {

        if(!socket.getAuthToken()) {
            return respond({ msg: MESSAGES.INVALID_TOKEN });
        }

        if(!name) {
            return respond({ msg: MESSAGES.NO_NAME });
        }

        if(!itemId) {
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

        const item = _.findWhere(player.inventory, { itemId: itemId });

        if (!item) {
            return respond({ msg: MESSAGES.BAD_ITEM });
        }

        // level requirements, maybe.

        player.inventory.push(player.equipment[item.type]);
        player.inventory = _.without(player.inventory, item);
        player.equipment[item.type] = item;
        player.calculate();
        player.save();

        updatePlayer(socket, player);

        respond(null, { msg: MESSAGES.EQUIP_SUCCESS });

    };

    socket.on('player:change:equipment', equip);
};