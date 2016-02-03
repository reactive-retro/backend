
import _ from 'lodash';

import dbPromise from '../../objects/db';
import MESSAGES from '../../static/messages';
import save from '../player/save';
import calculate from '../player/calculate';

export default (socket) => {

    // expect {name, homepoint}
    socket.on('homepoint', (options, respond) => {

        if(!socket.getAuthToken()) {
            return respond({msg: MESSAGES.INVALID_TOKEN});
        }

        const { name, homepoint } = options;

        if(!name) {
            return respond({msg: MESSAGES.NO_NAME});
        }

        if(!homepoint || !homepoint.lat || !homepoint.lon) {
            return respond({msg: MESSAGES.NO_HOMEPOINT});
        }

        dbPromise().then(db => {
            var players = db.collection('players');
            players.findOne({name: name}, (err, doc) => {

                if (err) {
                    return respond({msg: MESSAGES.GENERIC});
                }

                if (!doc) {
                    return respond({msg: MESSAGES.NO_PLAYER});
                }

                doc.homepoint = homepoint;

                save(doc);

                respond(null, {msg: MESSAGES.HOMEPOINT_CHANGE_SUCCESS, player: calculate(doc)});

            });
        });

    });
};