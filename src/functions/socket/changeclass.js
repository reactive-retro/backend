
import _ from 'lodash';

import getPlayer from '../player/getbyname';
import MESSAGES from '../../static/messages';
import save from '../player/save';
import calculate from '../player/calculate';
import fullheal from '../player/fullheal';

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

        getPlayer(name, respond).then(doc => {

            if(!_.contains(doc.unlockedProfessions, newProfession)) {
                return respond({msg: MESSAGES.INVALID_PROF});
            }

            if(!doc.professionLevels[newProfession]) {
                doc.professionLevels[newProfession] = 1;
            }

            doc.profession = newProfession;
            doc.skills = [];

            save(doc);

            respond(null, {msg: MESSAGES.PROF_CHANGE_SUCCESS, player: fullheal(calculate(doc))});
        });

    };

    socket.on('classchange', changeClass);
};