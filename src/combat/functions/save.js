
import _ from 'lodash';
import dbPromise from '../../objects/db';

export default async (battle) => {
    const saveObject = battle.saveObject();
    const db = await dbPromise();

    if(saveObject.isDone) {
        const battles = db.collection('battles');
        battles.deleteOne({ _id: saveObject._id }, _.noop);

    } else {
        const battles = db.collection('battles');
        battles.updateOne({ _id: saveObject._id }, saveObject, _.noop);
    }
};