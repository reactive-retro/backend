
import places from 'googleplaces';
import _ from 'lodash';

import MESSAGES from '../../static/messages';
import SETTINGS from '../../static/settings';

const RADIUS = SETTINGS.RADIUS;
const placesFactory = places(process.env.GOOGLE_PLACES_API_KEY, 'json');

export default (homepoint = {}) => {

    return new Promise((resolve, reject) => {

        placesFactory.placeSearch({location: [homepoint.lat, homepoint.lon], radius: RADIUS}, (err, res) => {

            if(err) {
                return reject(err);
            }

            var places = _.map(res.results, _.partialRight(_.pick, ['geometry', 'id', 'name', 'types']));

            resolve(places);

        });
    });
};