
import _ from 'lodash';
import uuid from 'node-uuid';
import seedrandom from 'seedrandom';

const prng = (seed) => () => {
    const rng = seedrandom(seed);
    const randoms = [];

    for(let i = 0, r; i < 16; i++) {
        if ((i & 0x03) === 0) { r = rng() * 0x100000000; }
        randoms[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return randoms;
};

export const itemId = (seed = Date.now()) => uuid.v4({ rng: prng(seed) });
export const monsterId = (seed = Date.now()) => uuid.v4({ rng: prng(seed) });

export const clamp = (min, max, num) => Math.max(min, Math.min(max, num));

export const randBetween = (min, max) => Math.floor((Math.random() * (max - min + 1))) + min;

export const simpleDistanceBetween = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

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

export const singleChoice = (array, seed) => {
    const rng = seedrandom(seed);
    const chosen = Math.floor(array.length * rng());
    return array[chosen];
};

export const weightedChoice = (array, seed) => {
    const rng = seedrandom(seed);

    // anything with a weight <= 0 can't be in here because it breaks the logic
    array = _.reject(array, item => item.weight <= 0);

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