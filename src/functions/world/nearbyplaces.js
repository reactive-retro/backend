
import _ from 'lodash';
import rest from 'restler';

import dbPromise from '../../objects/db';
import SETTINGS from '../../static/settings';

const RADIUS = SETTINGS.RADIUS;
const KEY = process.env.GOOGLE_PLACES_API_KEY;

export default async (homepoint) => {

    const db = await dbPromise();
    const cached = db.collection('homepointPlaces');

    return new Promise((resolve, reject) => {

        cached.findOne({ location: homepoint }, (err, doc) => {

            if(!doc || !doc.places) {

                let foundPlaces = [];

                const getPlaces = (token = '') => {

                    const baseUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
                    const fullUrl = `${baseUrl}?key=${KEY}&radius=${RADIUS}&location=${homepoint.lat},${homepoint.lon}&pagetoken=${token}`;

                    rest.get(fullUrl, { timeout: 10000 }).on('complete', data => {

                        if(data.results) {
                            const places = _.map(data.results, _.partialRight(_.pick, ['geometry', 'place_id', 'name', 'types']));
                            foundPlaces.push(...places);
                        }

                        if(data.next_page_token) {
                            // google requires an arbitrary delay between requests
                            // this is annoying.
                            setTimeout(() => getPlaces(data.next_page_token), 2000);

                        } else {
                            foundPlaces = _(foundPlaces).filter(place => place.geometry.location).uniq(place => place.place_id).value();
                            cached.insertOne({ location: homepoint, places: foundPlaces }, _.noop);
                            resolve(foundPlaces);
                        }

                    }).on('timeout', reject);
                };

                getPlaces();

            } else {
                resolve(doc.places);
            }

        });
    });
};