
import places from 'googleplaces';
import seedrandom from 'seedrandom';
import _ from 'lodash';

import MESSAGES from '../../static/messages';
import SETTINGS from '../../static/settings';

import monstergenerate, { verify as monsterverify } from '../../objects/monstergenerator';
import { calcDistanceBetween } from '../../character/functions/helpers';

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

const rateMonster = (distance) => {
    switch(Math.floor(distance)) {
        case 0:
            if(distance < 0.1) return -2;
            if(distance < 0.5) return -1;
            return 0;
        case 1: return distance < 1.3 ? 1 : 2;
        case 2: return 3;
        case 3: return 4;
        case 4: return 5;
    }
};

export const monstertoken = () => {
    return getSeed();
};

export default (homepoint = {}, playerReference) => {
    const { lat, lon } = homepoint;

    const seed = getSeed();

    const rng = seedrandom(seed);
    const numMonsters = randomBetween(rng, 650, 850);

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
            baseLevel: Math.max(1, playerReference.currentLevel + rating),
            rating,
            seed
        });

        monsters.push(monster);
    }

    return monsters;

};