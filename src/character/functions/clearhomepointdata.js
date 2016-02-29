
import _ from 'lodash';
import dbPromise from '../../objects/db';

export default async (homepoint) => {

    const db = await dbPromise();
    const homepointPlaces = db.collection('homepointPlaces');

    homepointPlaces.deleteMany({ location: homepoint }, _.noop);
};