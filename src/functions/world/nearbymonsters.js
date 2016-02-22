
import places from 'googleplaces';
import seedrandom from 'seedrandom';
import _ from 'lodash';

import MESSAGES from '../../static/messages';
import SETTINGS from '../../static/settings';

import monstergenerate, { verify as monsterverify } from '../../objects/monstergenerator';

// the offsets and directions to generate the bounds at which monsters spawn
const OFFSETS = {
    latDown: -0.025,
    latUp: 0.025,
    lonDown: -0.025,
    lonUp: 0.025
};

const randomBetween = (rng = Math.random, min, max) => rng() * (max - min) + min;

// seed monsters based on the hour
const getSeed = () => {
    const now = new Date();
    now.setMilliseconds(0);
    now.setSeconds(0);
    now.setMinutes(0);

    return now.getTime();
};

export const monstertoken = () => {
    return getSeed();
};

export default (homepoint = {}) => {
    const { lat, lon } = homepoint;

    const seed = getSeed();

    const rng = seedrandom(seed);
    const numMonsters = randomBetween(rng, 250, 500);

    const monsters = [];

    for(let i = 0; i < numMonsters; i++) {
        const monLat = randomBetween(rng, lat+OFFSETS.latDown, lat+OFFSETS.latUp);
        const monLon = randomBetween(rng, lon+OFFSETS.lonDown, lon+OFFSETS.lonUp);

        const monster = monstergenerate({
            location: {
                lat: monLat,
                lon: monLon
            },
            seed
        });

        monsters.push(monster);
    }

    return monsters;

};