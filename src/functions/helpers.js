
import _ from 'lodash';
import uuid from 'node-uuid';
import seedrandom from 'seedrandom';

export const itemId = () => uuid.v4();

export const calcDistanceBetween = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const toRad = (num) => num * (Math.PI / 180);

    const dLat = toRad(lat2-lat1);
    const dLon = toRad(lon2-lon1);

    lat1 = toRad(lat1);
    lat2 = toRad(lat2);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) *
            Math.cos(lat1) * Math.cos(lat2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
};

export const weightedChoice = (array, seed) => {
    const rng = seedrandom(seed);
    const maxWeight = _.reduce(array, (prev, cur) => prev + cur.weight, 0);

    const chosenValue = maxWeight * rng();
    let total = 0;
    let chosen = null;

    _.some(array, (object) => {
        if(chosenValue <= total + object.weight) {
            chosen = object;
            return true;
        }
        total += object.weight;
    });

    return chosen;
};