
import getPlayer from '../../../character/functions/getbyname';
import MESSAGES from '../../../static/messages';
import updatePlayer from '../../updaters/player';
import clearHomepointData from '../../../character/functions/clearhomepointdata';

export default (socket) => {

    const setHomepoint = async ({ name, homepoint }, respond) => {

        if(!socket.getAuthToken()) {
            return respond({ msg: MESSAGES.INVALID_TOKEN });
        }

        if(!name) {
            return respond({ msg: MESSAGES.NO_NAME });
        }

        if(!homepoint || !homepoint.lat || !homepoint.lon) {
            return respond({ msg: MESSAGES.NO_HOMEPOINT });
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

        clearHomepointData(player.homepoint);

        player.save();

        updatePlayer(socket, player);

        respond(null, { msg: MESSAGES.HOMEPOINT_CHANGE_SUCCESS });

    };

    socket.on('player:change:homepoint', setHomepoint);
};