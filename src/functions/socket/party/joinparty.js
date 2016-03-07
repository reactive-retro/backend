
import _ from 'lodash';

import getPlayer from '../../../character/functions/getbyname';
import MESSAGES from '../../../static/messages';
import SETTINGS from '../../../static/settings';

import { calcDistanceBetween } from '../../helpers';

import loadParty from '../../../party/functions/loadparty';
import updatePlayer from '../../../functions/updaters/player';

export default (socket, scWorker) => {

    const joinParty = async ({ name, partyId }, respond) => {

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

        let party = null;
        try {
            party = await loadParty(partyId);
        } catch(e) {
            return respond({ msg: MESSAGES.INVALID_PARTY });
        }

        if(party) {
            if(_.any(party.playerData, memberData => {
                return SETTINGS.MAX_PARTY_JOIN_DISTANCE < calcDistanceBetween(player.location.latitude, player.location.longitude, memberData.location.latitude, memberData.location.longitude);
            })) {
                return respond({ msg: MESSAGES.PARTY_TOO_FAR });
            }

            if(_.any(party.playerData, memberData => memberData.battleId)) {
                return respond({ msg: MESSAGES.PARTY_IN_COMBAT });
            }
        }

        if(party.players.length >= SETTINGS.MAX_PARTY_MEMBERS) {
            return respond({ msg: MESSAGES.PARTY_FULL });
        }

        if(player.battleId) {
            return respond({ msg: MESSAGES.CURRENTLY_IN_COMBAT });
        }

        party.playerJoin(player);
        party.notifyOfUpdates(scWorker);
        socket.emit('update:party', party.transmitObject());
        updatePlayer(socket, player);

        respond(null, { msg: MESSAGES.PARTY_JOIN_SUCCESSFUL });

    };

    socket.on('party:join', joinParty);
};