
import _ from 'lodash';
import dbPromise from '../../objects/db';

export default async (party) => {
    const saveObject = party.saveObject();
    const db = await dbPromise();
    const parties = db.collection('parties');

    if(saveObject.players.length === 0) {
        parties.deleteOne({ _id: saveObject._id }, _.noop);

    } else {
        parties.updateOne({ _id: saveObject._id }, saveObject, _.noop);
    }
};