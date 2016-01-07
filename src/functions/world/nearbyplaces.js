
import places from 'googleplaces';
import q from 'q';

import MESSAGES from '../../static/messages';

// TODO set this in a constant somewhere and send it from the server too
const RADIUS = 5000;
const placesFactory = places(process.env.GOOGLE_PLACES_API_KEY, 'json');

export default () => {

    const defer = q.defer();

    placesFactory.placeSearch({location: [options.latitude, options.longitude], radius: RADIUS}, function(err, res) {

        if(err) {
            return defer.reject();
        }

        var places = _.map(res.results, _.partialRight(_.pick, ['geometry', 'id', 'name', 'types']));

        defer.resolve(places);

    });

    return defer.promise;
};