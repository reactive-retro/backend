
import test from 'ava';
import Dice from 'dice.js';

import { allTraits } from '../../src/objects/traitmanager';

const allProfessions = require('require-dir')('../../src/character/professions');

const player = {
    str: 10, dex: 10, vit: 10, mnt: 10, luk: 10, acc: 10,
    hp: { minimum: 0, maximum: 1, __current: 1 },
    mp: { minimum: 0, maximum: 1, __current: 1 }
};

allTraits.forEach(trait => {
    test(`${trait.traitName} trait data is valid`, t => {
        // TODO make sure each effect can only have bonus or multiplier, never both!
    });
});
