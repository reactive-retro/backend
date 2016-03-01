
import _ from 'lodash';

import getPlayer from '../../../character/functions/getbyname';
import MESSAGES from '../../../static/messages';
import updatePlayer from '../../updaters/player';

export default (socket) => {

    const sell = async ({ name, itemId }, respond) => {

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

        _.remove(player.inventory, item);
        player.addGold(Math.floor(item.value / 4));

        player.save();

        updatePlayer(socket, player);

        respond(null, { msg: MESSAGES.SELL_SUCCESS });

    };

    socket.on('player:sell:equipment', sell);
};