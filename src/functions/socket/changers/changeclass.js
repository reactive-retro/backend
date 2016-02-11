
import _ from 'lodash';

import getPlayer from '../../../character/functions/getbyname';
import MESSAGES from '../../../static/messages';

import SkillManager from '../../../objects/skillmanager';

export default (socket) => {

    const changeClass = ({ name, newProfession }, respond) => {

        if(!socket.getAuthToken()) {
            return respond({msg: MESSAGES.INVALID_TOKEN});
        }

        if(!name) {
            return respond({msg: MESSAGES.NO_NAME});
        }

        if(!newProfession) {
            return respond({msg: MESSAGES.NO_CLASS});
        }

        getPlayer(name, respond).then(player => {

            if(!_.contains(player.unlockedProfessions, newProfession)) {
                return respond({msg: MESSAGES.INVALID_PROF});
            }

            if(!player.professionLevels[newProfession]) {
                player.professionLevels[newProfession] = 1;
            }

            player.profession = newProfession;
            player.skills = [];
            player.save();

            player.fullheal();

            socket.emit('update:player', player);
            socket.emit('update:skills', SkillManager.getSkills(doc));

            respond(null, {msg: MESSAGES.PROF_CHANGE_SUCCESS});
        });

    };

    socket.on('player:change:class', changeClass);
};