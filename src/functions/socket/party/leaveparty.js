
import _ from 'lodash';

import getPlayer from '../../../character/functions/getbyname';
import MESSAGES from '../../../static/messages';

import loadParty from '../../../party/functions/loadparty';
import updatePlayer from '../../updaters/player';

export default (socket, scWorker) => {

    const leaveParty = async ({ name }, respond) => {

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

        if(!player.partyId) {
            return respond({ msg: MESSAGES.NOT_IN_PARTY });
        }

        let party = null;
        try {
            party = await loadParty(player.partyId);
        } catch(e) {
            return respond({ msg: MESSAGES.NOT_IN_PARTY });
        }

        party.playerLeave(player);
        party.notifyOfUpdates(scWorker);
        socket.emit('update:party', null);
        updatePlayer(socket, player);

        respond(null, { msg: MESSAGES.PARTY_LEAVE_SUCCESSFUL });

    };

    socket.on('party:leave', leaveParty);
};