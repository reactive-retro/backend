
import _ from 'lodash';

import getPlayer from '../../../character/functions/getbyname';
import MESSAGES from '../../../static/messages';

export default (socket) => {

    const equip = ({ name, itemId }, respond) => {

        if(!socket.getAuthToken()) {
            return respond({msg: MESSAGES.INVALID_TOKEN});
        }

        if(!name) {
            return respond({msg: MESSAGES.NO_NAME});
        }

        if(!itemId) {
            return respond({msg: MESSAGES.NO_ITEM});
        }

        getPlayer(name, respond).then(player => {

            var item = _.findWhere(player.inventory, {itemId: itemId});

            if (!item) {
                return respond({msg: MESSAGES.BAD_ITEM});
            }

            // level requirements, maybe.

            player.inventory.push(player.equipment[item.type]);
            player.inventory = _.without(player.inventory, item);
            player.equipment[item.type] = item;
            player.save();

            socket.emit('update:player', player);

            respond(null, {msg: MESSAGES.EQUIP_SUCCESS});

        });

    };

    socket.on('player:change:equipment', equip);
};