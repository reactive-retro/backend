
import _ from 'lodash';
import rest from 'restler';

import dbPromise from '../../objects/db';
import SETTINGS from '../../static/settings';

import placeGenerator from '../../objects/placegenerator';

const RADIUS = SETTINGS.RADIUS;
const KEY = process.env.GOOGLE_PLACES_API_KEY;

const handlePlaces = async (resolve, places, genOpts) => {
    const placePromises = _.map(places, place => placeGenerator(place, genOpts));
    const allPlaces = await Promise.all(placePromises);
    resolve(allPlaces);
};

const isPlaceAllowed = (place) => _.intersection(['locality'], place.types).length === 0;

export default async (homepoint, genOpts) => {

    const db = await dbPromise();
    const cached = db.collection('homepointPlaces');

    return new Promise((resolve, reject) => {

        let foundPlaces = [];

        const getPlaces = (token = '') => {

            const baseUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

            // RADIUS*0.8 so it doesn't draw any places that *might* be on or over the edge, that'd be silly
            const fullUrl = `${baseUrl}?key=${KEY}&radius=${RADIUS*0.8}&location=${homepoint.lat},${homepoint.lon}&pagetoken=${token}`;

            rest.get(fullUrl, { timeout: 10000 }).on('complete', data => {

                if(data.results) {
                    const places = _(data.results)
                        .filter(isPlaceAllowed)
                        .map(_.partialRight(_.pick, ['geometry', 'place_id', 'name', 'types']))
                        .value();
                    foundPlaces.push(...places);
                }

                if(data.next_page_token) {
                    // google requires an arbitrary delay between requests
                    // this is annoying.
                    setTimeout(() => getPlaces(data.next_page_token), 2000);

                } else {
                    foundPlaces = _(foundPlaces).filter(place => place.geometry.location).uniq(place => place.place_id).value();
                    cached.insertOne({ location: homepoint, places: foundPlaces }, _.noop);
                    handlePlaces(resolve, foundPlaces, genOpts);
                }

            }).on('timeout', reject);
        };

        cached.findOne({ location: homepoint }, (err, doc) => {

            if(!doc || !doc.places) {
                getPlaces();

            } else {
                handlePlaces(resolve, doc.places, genOpts);
            }

        });
    });
};