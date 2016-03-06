
import _ from 'lodash';
import dbPromise from '../../objects/db';

export default async (battle) => {
    const saveObject = battle.saveObject();
    const db = await dbPromise();
    const battles = db.collection('battles');

    if(saveObject.isDone || saveObject.players.length === 0) {
        battles.deleteOne({ _id: saveObject._id }, _.noop);

    } else {
        battles.updateOne({ _id: saveObject._id }, saveObject, _.noop);
    }
};