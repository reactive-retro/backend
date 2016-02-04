
import _ from 'lodash';

import getPlayer from '../player/getbyname';
import MESSAGES from '../../static/messages';
import save from '../player/save';
import calculate from '../player/calculate';
import fullheal from '../player/fullheal';

import SkillManager from '../../objects/skillmanager';

export default (socket) => {

    const getSkills = ({ name }, respond) => {

        if(!socket.getAuthToken()) {
            return respond({msg: MESSAGES.INVALID_TOKEN});
        }

        if(!name) {
            return respond({msg: MESSAGES.NO_NAME});
        }

        getPlayer(name, respond).then(doc => {

            respond(null, {skills: SkillManager.getSkills(doc)});

        });

    };

    socket.on('getskills', getSkills);
};