
import _ from 'lodash';
import dbPromise from '../../objects/db';

export default (battle) => {
    const saveObject = battle.saveObject();

    if(saveObject.isDone) {
        dbPromise().then(db => {
            const battles = db.collection('battles');
            battles.deleteOne({ _id: saveObject._id }, _.noop);
        });

    } else {
        dbPromise().then(db => {
            const battles = db.collection('battles');
            battles.update({_id: saveObject._id}, saveObject, _.noop);
        });
    }
};