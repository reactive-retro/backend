
import getPlayer from '../../../character/functions/getbyname';
import MESSAGES from '../../../static/messages';

import updatePlayer from '../../updaters/player';

export default (socket) => {

    const changeLocation = async ({ name, coords }, respond) => {

        if(!socket.getAuthToken()) {
            return respond({ msg: MESSAGES.INVALID_TOKEN });
        }

        if(!name) {
            return respond({ msg: MESSAGES.NO_NAME });
        }

        if(!coords) {
            return respond({ msg: MESSAGES.NO_COORDS });
        }

        let player = null;

        try {
            player = await getPlayer(name);
        } catch(e) {
            return respond({ msg: e.msg });
        }

        updatePlayer(socket, player, false);

        respond(null);

    };

    socket.on('player:change:location', changeLocation);
};