
import seedrandom from 'seedrandom';

import monstergenerate from '../../objects/monstergenerator';
import { calcDistanceBetween } from '../helpers';
import availableMonsters from './availablemonsters';

const randomBetween = (rng = Math.random, min, max) => rng() * (max - min) + min;
const normalBetween = (rng = Math.random, min, max) => {
    const normalRng = () => (rng() + rng() + rng() + rng() - 2) / 2;
    return randomBetween(normalRng, min, max);
};
const normalAround = (rng = Math.random, min, max) => {
    const normalRng = () => (3 / (rng() + rng() + rng() + rng() + rng() + rng() - 3)) / 3;
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

export const monstertoken = (extraData = '') => {
    return getSeed() + extraData;
};

export default async ({ lat, lon, playerLevel, ratingOffset, offsets, amounts, seed }) => {
    if(!seed) seed = getSeed();
    if(!ratingOffset) ratingOffset = 0;

    // monster generation for places has a tight generation area
    // placing them right on top of the place makes them hard to hit
    const normalFunction = ratingOffset > 0 ? normalAround : normalBetween;

    const possibleMonsters = await availableMonsters(playerLevel);

    const rng = seedrandom(seed);
    const numMonsters = randomBetween(rng, amounts.min, amounts.max);

    const monsters = [];

    for(let i = 0; i < numMonsters; i++) {
        const monLat = normalFunction(rng, lat-offsets.lat, lat+offsets.lat) + offsets.lat;
        const monLon = normalFunction(rng, lon-offsets.lon, lon+offsets.lon) + offsets.lon;

        const distanceBetweenHomepointAndMonster = calcDistanceBetween(lat, lon, monLat, monLon);
        const rating = rateMonster(distanceBetweenHomepointAndMonster) + ratingOffset;

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