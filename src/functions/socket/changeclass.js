
import _ from 'lodash';

import dbPromise from '../../objects/db';
import MESSAGES from '../../static/messages';
import save from '../save';
import calculate from '../calculate';
import fullheal from '../fullheal';

export default (socket) => {

    // expect {name, newProfession}
    socket.on('classchange', (options, respond) => {

        if(!socket.getAuthToken()) {
            return respond({msg: MESSAGES.INVALID_TOKEN});
        }

        if(!options.name) {
            return respond({msg: MESSAGES.NO_NAME});
        }

        if(!options.newProfession) {
            return respond({msg: MESSAGES.NO_CLASS});
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

                if(!_.contains(doc.unlockedProfessions, options.newProfession)) {
                    return respond({msg: MESSAGES.INVALID_PROF});
                }

                if(!doc.professionLevels[options.newProfession]) {
                    doc.professionLevels[options.newProfession] = 1;
                }

                doc.profession = options.newProfession;

                save(doc);

                respond(null, {msg: MESSAGES.PROF_CHANGE_SUCCESS, player: fullheal(calculate(doc))});

            });
        });

    });
};