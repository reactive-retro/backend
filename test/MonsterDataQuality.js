
import test from 'ava';

import { loadDataFile } from './helpers';

let monsterData = null;

const validProfessions = require('require-dir')('../src/character/professions');
const isValidProfession = (profession) => validProfessions[profession];

test.serial('Monster data is valid hjson', t => {
    monsterData = loadDataFile('monster');
    t.pass();
});

test('Monsters have valid attribute values', t => {
    monsterData.forEach(monster => {
        t.ok(monster.name);
        t.ok(monster.weight);
        t.ok(monster.minLevel);
        t.ok(monster.maxLevel);
        t.ok(isValidProfession(monster.profession));

        t.true(monster.minLevel > 0);
        t.true(monster.maxLevel <= 100);
        t.true(monster.minLevel <= monster.maxLevel);

        if(monster.skills) {
            t.true(Array.isArray(monster.skills));
            t.true(monster.skills.length > 0);
        }

        if(monster.extendProfessions) {
            Object.keys(monster.extendProfessions).forEach(profession => {
                t.ok(isValidProfession(profession));
                t.true(monster.extendProfessions[profession] > 0);
            });
        }
    });
    t.pass();
});