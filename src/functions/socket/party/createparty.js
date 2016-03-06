
import _ from 'lodash';

import getPlayer from '../../../character/functions/getbyname';
import MESSAGES from '../../../static/messages';

import insertParty from '../../../party/functions/insertparty';

export default (socket) => {

    const createParty = async ({ name }, respond) => {

        if(!socket.getAuthToken()) {
            return respond({ msg: MESSAGES.INVALID_TOKEN });
        }

        if(!name) {
            return respond({ msg: MESSAGES.NO_NAME });
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

        if(player.partyId) {
            return respond({ msg: MESSAGES.ALREADY_IN_PARTY });
        }

        let party = null;

        try {
            party = await insertParty({ players: [player] });
        } catch(e) {
            return respond({ msg: MESSAGES.PARTY_CREATE_FAILED });
        }

        socket.emit('update:party', party.transmitObject());

        respond(null, { msg: MESSAGES.PARTY_CREATE_SUCCESSFUL });

    };

    socket.on('party:create', createParty);
};