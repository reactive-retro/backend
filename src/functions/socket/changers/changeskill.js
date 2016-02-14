
import _ from 'lodash';

import getPlayer from '../../../character/functions/getbyname';
import MESSAGES from '../../../static/messages';

import SkillManager from '../../../objects/skillmanager';

// 6 skill slots
const MIN_SLOT = 0;
const MAX_SLOT = 5;

export default (socket) => {

    const skillChange = ({ name, skillName, skillSlot }, respond) => {

        if(!socket.getAuthToken()) {
            return respond({msg: MESSAGES.INVALID_TOKEN});
        }

        if(!name) {
            return respond({msg: MESSAGES.NO_NAME});
        }

        if(skillName !== null && !SkillManager.doesSkillExist(skillName)) {
            return respond({msg: MESSAGES.NO_SKILL});
        }

        if(SkillManager.isSkillDisabled(skillName)) {
            return respond({msg: MESSAGES.SKILL_DISABLED});
        }

        if(!_.isNumber(skillSlot) || skillSlot < MIN_SLOT || skillSlot > MAX_SLOT || skillSlot % 1 !== 0) {
            return respond({msg: MESSAGES.BAD_SLOT})
        }

        getPlayer(name, respond).then(player => {

            player.skills[skillSlot] = skillName || undefined;
            player.save();

            socket.emit('update:player', player);

            respond(null, {msg: MESSAGES.SKILL_CHANGE_SUCCESS});

        });

    };

    socket.on('player:change:skill', skillChange);
};