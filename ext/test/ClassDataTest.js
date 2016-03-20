
import test from 'ava';

import { allProfessions } from '../../src/objects/professionmanager';
const professionHash = require('require-dir')('../../src/character/professions');

Object.keys(allProfessions).forEach(profName => {
    const prof = allProfessions[profName];

    test(`${prof.name} class data is valid`, t => {
        t.ok(prof.description);
        t.ok(prof.hp);
        t.ok(prof.mp);
        t.ok(prof.str);
        t.ok(prof.dex);
        t.ok(prof.mnt);
        t.ok(prof.vit);
        t.ok(prof.luk);

        if(prof.prerequisites) {
            Object.keys(prof.prerequisites).forEach(profName => {
                t.true(prof.prerequisites[profName] > 0);
                t.ok(professionHash[profName]);
            });
        }
    });
});