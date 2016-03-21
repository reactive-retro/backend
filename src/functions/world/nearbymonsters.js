
import seedrandom from 'seedrandom';

import Logger from '../../objects/logger';

import monstergenerate from '../../objects/monstergenerator';
import { calcDistanceBetween, clamp as clampNumber } from '../helpers';
import availableMonsters from './availablemonsters';

const randomBetween = (rng = Math.random, min, max) => rng() * (max - min) + min;

const nRng = (rng, n = 2) => {
    let ret = 0;
    for(let i = 0; i < n; i++) ret += rng();
    ret -= n/2;
    ret /= n/2;
    return ret;
};

const normalBetween = (rng = Math.random, min, max) => {
    const normalRng = () => nRng(rng, 1);
    return randomBetween(normalRng, min, max);
};
const normalAround = (rng = Math.random, min, max) => {
    const normalRng = () => 1 / (rng() + rng() + rng() + rng() + rng() + rng() - 3) / 3;
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

const getMonsterLocation = ({ normalFunction, offsets, lat, lon, clamp = false }) => {

    const angle     = normalFunction(0, 2 * Math.PI);
    const distance  = normalFunction(0, offsets.radius);

    let monLat = lat + distance * Math.cos(angle);
    let monLon = lon + distance * Math.sin(angle);

    if(clamp) {
        monLat = clampNumber(lat - offsets.lat, lat + offsets.lat, monLat);
        monLon = clampNumber(lon - offsets.lon, lon + offsets.lon, monLon);
    }

    return {
        monLat,
        monLon
    };
};

export default async ({ lat, lon, playerLevel, ratingOffset, offsets, amounts, seed, zone, statBuff }) => {
    if(!seed) seed = getSeed();
    if(!ratingOffset) ratingOffset = 0;
    if(!zone) zone = 'All';
    if(!statBuff) statBuff = {};

    // monster generation for places has a tight generation area
    // placing them right on top of the place makes them hard to hit
    const rng = seedrandom(seed);
    const normalFunction = (ratingOffset > 0 ? normalAround : normalBetween).bind(null, rng);

    const possibleMonsters = await availableMonsters(playerLevel, zone);

    const numMonsters = randomBetween(rng, amounts.min, amounts.max);

    const monsters = [];

    for(let i = 0; i < numMonsters; i++) {
        const { monLat, monLon } = getMonsterLocation({ normalFunction, offsets, lat, lon, clamp: ratingOffset > 0 });

        const distanceBetweenHomepointAndMonster = calcDistanceBetween(lat, lon, monLat, monLon);
        const rating = rateMonster(distanceBetweenHomepointAndMonster) + ratingOffset;

        try {
            const monster = monstergenerate({
                location: {
                    lat: monLat,
                    lon: monLon
                },

                // no negative level monsters
                baseLevel: Math.max(1, playerLevel + rating),
                rating,
                statBuff,

                // if they are all the same seed, they will all be the same monster, which is bad
                seed: seed+i
            }, possibleMonsters);

            monsters.push(monster);
        } catch(e) {
            Logger.error('NearbyMonsters:Generate', e);
        }
    }

    return new Promise(async (resolve, reject) => {
        try {
            const allMonsters = await Promise.all(monsters);
            resolve(allMonsters);
        } catch(e) {
            Logger.error('NearbyMonsters:Promise', e);
            reject(e);
        }
    });

};