
import q from 'q';

import dbPromise from '../../objects/db';
import MESSAGES from '../../static/messages';

import Player from '../base/Player';

export default (name, respond = () => {}) => {

    const defer = q.defer();

    dbPromise().then(db => {
        var players = db.collection('players');
        players.findOne({name: name}, (err, doc) => {

            if (err) {
                defer.reject(err);
                return respond({msg: MESSAGES.GENERIC});
            }

            if (!doc) {
                defer.reject(err);
                return respond({msg: MESSAGES.NO_PLAYER});
            }

            defer.resolve(new Player(doc));
        })
    });

    return defer.promise;
};