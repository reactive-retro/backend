
import _ from 'lodash';

import dbPromise from '../../objects/db';
import MESSAGES from '../../static/messages';
import save from '../player/save';
import calculate from '../player/calculate';
import fullheal from '../player/fullheal';

export default (socket) => {

    // expect {name, newProfession}
    socket.on('classchange', (options, respond) => {

        if(!socket.getAuthToken()) {
            return respond({msg: MESSAGES.INVALID_TOKEN});
        }

        const { name, newProfession } = options;

        if(!name) {
            return respond({msg: MESSAGES.NO_NAME});
        }

        if(!newProfession) {
            return respond({msg: MESSAGES.NO_CLASS});
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

                if(!_.contains(doc.unlockedProfessions, newProfession)) {
                    return respond({msg: MESSAGES.INVALID_PROF});
                }

                if(!doc.professionLevels[newProfession]) {
                    doc.professionLevels[newProfession] = 1;
                }

                doc.profession = newProfession;

                save(doc);

                respond(null, {msg: MESSAGES.PROF_CHANGE_SUCCESS, player: fullheal(calculate(doc))});

            });
        });

    });
};