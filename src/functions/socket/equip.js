
import _ from 'lodash';

import getPlayer from '../player/getbyname';
import MESSAGES from '../../static/messages';
import save from '../player/save';
import calculate from '../player/calculate';

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

        getPlayer(name, respond).then(doc => {

            var item = _.findWhere(doc.inventory, {itemId: itemId});

            if (!item) {
                return respond({msg: MESSAGES.BAD_ITEM});
            }

            // level requirements, maybe.

            doc.inventory.push(doc.equipment[item.type]);
            doc.inventory = _.without(doc.inventory, item);
            doc.equipment[item.type] = item;

            save(doc);

            respond(null, {msg: MESSAGES.EQUIP_SUCCESS, player: calculate(doc)});

        });

    };

    socket.on('equip', equip);
};