
import _ from 'lodash';

import getPlayer from '../../../character/functions/getbyname';
import { verify as placeVerify } from '../../../objects/placegenerator';
import MESSAGES from '../../../static/messages';
import updatePlayer from '../../updaters/player';

export default (socket) => {

    const takeItem = async ({ name, place, itemId }, respond) => {

        if(!name) {
            return respond({ msg: MESSAGES.NO_NAME });
        }

        if(!placeVerify(place)) {
            return respond({ msg: MESSAGES.BAD_PLACE });
        }

        const item = _.find(place.contents, { itemId });
        if(!item) {
            return respond({ msg: MESSAGES.ITEM_NONEXISTENT });
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

        if(player.hasTakenAction('shop', place.seed, itemId)) {
            return respond({ msg: MESSAGES.ALREADY_TAKEN_ITEM });
        }

        if(!player.canAddToInventory()) {
            return respond({ msg: MESSAGES.INVENTORY_FULL });
        }

        player.addToInventory(item);
        player.markActionTaken('shop', place.seed, itemId);
        player.save();

        updatePlayer(socket, player);

        respond({ msg: MESSAGES.SUCCESSFUL_TAKE });
    };

    socket.on('shop:take', takeItem);
};