
import _ from 'lodash';

import dbPromise from '../../objects/db';
import MESSAGES from '../../static/messages';
import save from '../player/save';
import calculate from '../player/calculate';
import fullheal from '../player/fullheal';

import SkillManager from '../../objects/skillmanager';

// 6 skill slots
const MIN_SLOT = 0;
const MAX_SLOT = 5;

export default (socket) => {

    // expect {name, skillName, skillSlot}
    socket.on('skillchange', (options, respond) => {

        if(!socket.getAuthToken()) {
            return respond({msg: MESSAGES.INVALID_TOKEN});
        }

        const { name, skillName, skillSlot } = options;

        if(!name) {
            return respond({msg: MESSAGES.NO_NAME});
        }

        if(skillName !== null && !SkillManager.doesSkillExist(skillName)) {
            return respond({msg: MESSAGES.NO_SKILL});
        }

        if(!_.isNumber(skillSlot) || skillSlot < MIN_SLOT || skillSlot > MAX_SLOT || skillSlot % 1 != 0) {
            return respond({msg: MESSAGES.BAD_SLOT})
        }

        dbPromise().then(db => {
            var players = db.collection('players');
            players.findOne({name: name}, (err, doc) => {

                if(err) {
                    return respond({msg: MESSAGES.GENERIC});
                }

                if(!doc) {
                    return respond({msg: MESSAGES.NO_PLAYER});
                }

                doc.skills[skillSlot] = skillName;

                save(doc);

                respond(null, {msg: MESSAGES.SKILL_CHANGE_SUCCESS, player: fullheal(calculate(doc))});

            });
        });

    });
};