
import _ from 'lodash';

import getPlayer from '../player/getbyname';
import MESSAGES from '../../static/messages';
import save from '../player/save';
import calculate from '../player/calculate';

export default (socket) => {

    const setHomepoint = ({ name, homepoint }, respond) => {

        if(!socket.getAuthToken()) {
            return respond({msg: MESSAGES.INVALID_TOKEN});
        }

        if(!name) {
            return respond({msg: MESSAGES.NO_NAME});
        }

        if(!homepoint || !homepoint.lat || !homepoint.lon) {
            return respond({msg: MESSAGES.NO_HOMEPOINT});
        }

        getPlayer(name, respond).then(doc => {

            doc.homepoint = homepoint;

            save(doc);

            respond(null, {msg: MESSAGES.HOMEPOINT_CHANGE_SUCCESS, player: calculate(doc)});

        });

    };

    socket.on('homepoint', setHomepoint);
};