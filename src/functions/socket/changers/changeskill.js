
import _ from 'lodash';

import getPlayer from '../../../character/functions/getbyname';
import MESSAGES from '../../../static/messages';

import SkillManager from '../../../objects/skillmanager';
import updatePlayer from '../../updaters/player';

// 6 skill slots
const MIN_SLOT = 0;
const MAX_SLOT = 5;

export default (socket) => {

    const skillChange = async ({ name, skillName, skillSlot }, respond) => {

        if(!socket.getAuthToken()) {
            return respond({ msg: MESSAGES.INVALID_TOKEN });
        }

        if(!name) {
            return respond({ msg: MESSAGES.NO_NAME });
        }

        if(skillName !== null && !SkillManager.doesSkillExist(skillName)) {
            return respond({ msg: MESSAGES.NO_SKILL });
        }

        if(SkillManager.isSkillDisabled(skillName) || SkillManager.isSkillUnstackable(skillName)) {
            return respond({ msg: MESSAGES.SKILL_DISABLED });
        }

        if(!_.isNumber(skillSlot) || skillSlot < MIN_SLOT || skillSlot > MAX_SLOT || skillSlot % 1 !== 0) {
            return respond({ msg: MESSAGES.BAD_SLOT });
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
        
        player.skills[skillSlot] = skillName || undefined;
        player.save();

        updatePlayer(socket, player);

        respond(null, { msg: MESSAGES.SKILL_CHANGE_SUCCESS });

    };

    socket.on('player:change:skill', skillChange);
};