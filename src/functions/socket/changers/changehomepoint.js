
import _ from 'lodash';

import getPlayer from '../../../character/functions/getbyname';
import MESSAGES from '../../../static/messages';

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

        getPlayer(name, respond).then(player => {

            player.homepoint = homepoint;
            player.save();

            socket.emit('update:player', player);

            respond(null, {msg: MESSAGES.HOMEPOINT_CHANGE_SUCCESS});

        });

    };

    socket.on('player:change:homepoint', setHomepoint);
};