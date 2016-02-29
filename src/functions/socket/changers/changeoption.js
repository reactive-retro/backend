
import _ from 'lodash';

import getPlayer from '../../../character/functions/getbyname';
import MESSAGES from '../../../static/messages';

export default (socket) => {

    const optionsChange = async ({ name, optionsHash }, respond) => {

        if(!socket.getAuthToken()) {
            return respond({ msg: MESSAGES.INVALID_TOKEN });
        }

        if(!name) {
            return respond({ msg: MESSAGES.NO_NAME });
        }

        if(_.isEmpty(optionsHash)) {
            return respond({ msg: MESSAGES.NO_SETTINGS });
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

        _.extend(player.options, optionsHash);
        player.save();

        socket.emit('update:options', player.options);

        respond(null, { msg: MESSAGES.SETTING_SUCCESS });

    };

    socket.on('player:change:options', optionsChange);
};