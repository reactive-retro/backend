
import q from 'q';

import dbPromise from '../../objects/db';
import MESSAGES from '../../static/messages';

export default (name, respond) => {

    const defer = q.defer();

    dbPromise().then(db => {
        var players = db.collection('players');
        players.findOne({name: name}, (err, doc) => {

            if (err) {
                defer.reject();
                return respond({msg: MESSAGES.GENERIC});
            }

            if (!doc) {
                defer.reject();
                return respond({msg: MESSAGES.NO_PLAYER});
            }

            defer.resolve(doc);
        })
    });

    return defer.promise;
};