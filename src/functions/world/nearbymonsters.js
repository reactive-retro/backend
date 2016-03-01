
import seedrandom from 'seedrandom';

import monstergenerate from '../../objects/monstergenerator';
import { calcDistanceBetween } from '../helpers';
import availableMonsters from './availablemonsters';

// the offsets and directions to generate the bounds at which monsters spawn
const OFFSETS = {
    lat: 0.025,
    lon: 0.025
};

const randomBetween = (rng = Math.random, min, max) => rng() * (max - min) + min;
const normalBetween = (rng = Math.random, min, max) => {
    const normalRng = () => (rng() + rng() + rng() + rng() - 2) / 2;
    return randomBetween(normalRng, min, max);
};

// seed monsters based on the hour
const getSeed = () => {
    const now = new Date();
    now.setMilliseconds(0);
    now.setSeconds(0);
    now.setMinutes(0);

    return now.getTime();
};

// arbitrary but simple rating calculation which favors median and far-away monsters
const rateMonster = (distance) => {
    switch(Math.floor(distance)) {
        case 0:
            if(distance < 0.1) return -2;
            if(distance < 0.5) return -1;
            return 0;
        case 1: return distance < 1.3 ? 1 : 2;
        case 2: return 3;
        case 3: return 4;
        default: return 5;
    }
};

export const monstertoken = () => {
    return getSeed();
};

export default async ({ lat, lon }, playerLevel) => {

    const possibleMonsters = await availableMonsters(playerLevel);

    const seed = getSeed();

    const rng = seedrandom(seed);
    const numMonsters = randomBetween(rng, 500, 650);

    const monsters = [];

    for(let i = 0; i < numMonsters; i++) {
        const monLat = normalBetween(rng, lat-OFFSETS.lat, lat+OFFSETS.lat) + OFFSETS.lat;
        const monLon = normalBetween(rng, lon-OFFSETS.lon, lon+OFFSETS.lon) + OFFSETS.lon;

        const distanceBetweenHomepointAndMonster = calcDistanceBetween(lat, lon, monLat, monLon);
        const rating = rateMonster(distanceBetweenHomepointAndMonster);

        const monster = monstergenerate({
            location: {
                lat: monLat,
                lon: monLon
            },

            // no negative level monsters
            baseLevel: Math.max(1, playerLevel + rating),
            rating,

            // if they are all the same seed, they will all be the same monster, which is bad
            seed: seed+i
        }, possibleMonsters);

        monsters.push(monster);
    }

    return new Promise(async (resolve) => {
        const allMonsters = await Promise.all(monsters);
        resolve(allMonsters);
    });

};