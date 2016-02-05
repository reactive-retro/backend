
import places from 'googleplaces';
import q from 'q';
import _ from 'lodash';

import MESSAGES from '../../static/messages';
import SETTINGS from '../../static/settings';

const RADIUS = SETTINGS.RADIUS;
const placesFactory = places(process.env.GOOGLE_PLACES_API_KEY, 'json');

export default (homepoint = {}) => {

    const defer = q.defer();

    placesFactory.placeSearch({location: [homepoint.lat, homepoint.lon], radius: RADIUS}, function(err, res) {

        if(err) {
            return defer.reject();
        }

        var places = _.map(res.results, _.partialRight(_.pick, ['geometry', 'id', 'name', 'types']));

        defer.resolve(places);

    });

    return defer.promise;
};