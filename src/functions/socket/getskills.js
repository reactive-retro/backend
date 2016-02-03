
import _ from 'lodash';

import dbPromise from '../../objects/db';
import MESSAGES from '../../static/messages';
import save from '../player/save';
import calculate from '../player/calculate';
import fullheal from '../player/fullheal';

import SkillManager from '../../objects/skillmanager';

export default (socket) => {

    // expect {name, }
    socket.on('getskills', (options, respond) => {

        if(!socket.getAuthToken()) {
            return respond({msg: MESSAGES.INVALID_TOKEN});
        }

        if(!options.name) {
            return respond({msg: MESSAGES.NO_NAME});
        }

        dbPromise().then(db => {
            var players = db.collection('players');
            players.findOne({name: options.name}, (err, doc) => {

                if(err) {
                    return respond({msg: MESSAGES.GENERIC});
                }

                if(!doc) {
                    return respond({msg: MESSAGES.NO_PLAYER});
                }

                respond(null, {skills: SkillManager.getSkills(doc)});

            });
        });

    });
};