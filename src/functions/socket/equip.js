
import _ from 'lodash';

import dbPromise from '../../objects/db';
import MESSAGES from '../../static/messages';
import save from '../save';
import calculate from '../calculate';

export default (socket) => {

    // expect {name, itemId}
    socket.on('equip', (options, respond) => {

        if(!socket.getAuthToken()) {
            return respond({msg: MESSAGES.INVALID_TOKEN});
        }

        if(!options.name) {
            return respond({msg: MESSAGES.NO_NAME});
        }

        if(!options.itemId) {
            return respond({msg: MESSAGES.NO_ITEM});
        }

        dbPromise().then(db => {
            var players = db.collection('players');

            players.findOne({name: options.name}, (err, doc) => {

                if (err) {
                    return respond({msg: MESSAGES.GENERIC});
                }

                if (!doc) {
                    return respond({msg: MESSAGES.NO_PLAYER});
                }

                var item = _.findWhere(doc.inventory, {itemId: options.itemId});

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
        });

    });
};