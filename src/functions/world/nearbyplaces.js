
import places from 'googleplaces';
import _ from 'lodash';

import dbPromise from '../../objects/db';

import SETTINGS from '../../static/settings';

const RADIUS = SETTINGS.RADIUS;
const placesFactory = places(process.env.GOOGLE_PLACES_API_KEY, 'json');

export default async (homepoint) => {

    const db = await dbPromise();
    const cached = db.collection('homepointPlaces');

    return new Promise((resolve, reject) => {

        cached.findOne({ location: homepoint }, (err, doc) => {

            if(!doc || !doc.places) {
                placesFactory.placeSearch({ location: [homepoint.lat, homepoint.lon], radius: RADIUS }, (err, res) => {

                    if(err) {
                        return reject(err);
                    }

                    const places = _.map(res.results, _.partialRight(_.pick, ['geometry', 'id', 'name', 'types']));

                    cached.insertOne({ location: homepoint, places }, _.noop);

                    resolve(places);

                });
            } else {
                resolve(doc.places);
            }

        });
    });
};