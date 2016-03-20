
import test from 'ava';
import Dice from 'dice.js';

import { allSkills } from '../../src/objects/skillmanager';

const allProfessions = require('require-dir')('../../src/character/professions');

const player = {
    str: 10, dex: 10, vit: 10, mnt: 10, luk: 10, acc: 10,
    hp: { minimum: 0, maximum: 1, __current: 1 },
    mp: { minimum: 0, maximum: 1, __current: 1 }
};

allSkills.forEach(skill => {
    test(`${skill.spellName} spell data is valid`, t => {

        t.ok(skill.spellName);
        if(skill.spellCost) t.true(skill.spellCost >= 0);
        if(skill.spellCooldown) t.true(skill.spellCooldown >= 0);

        t.true(skill.spellTimes > 0);

        const usedProfessions = Object.keys(skill.spellClasses);
        t.true(usedProfessions.length > 0);
        usedProfessions.forEach(prof => {
            t.true(prof === 'All' || !!allProfessions[prof]);
            t.true(skill.spellClasses[prof] > 0);
        });

        t.ok(skill.spellTargets);
        t.ok(skill.spellDescription);
        t.ok(skill.spellUseString);

        t.true(Object.keys(skill.spellEffects).length > 0);

        Object.keys(skill.spellEffects).forEach(skillEffect => {
            if(skillEffect.chance) t.true(skillEffect.chance > 0 && skillEffect.chance <= 100);
            if(skillEffect.roll) {
                const testRoll = +Dice.roll(skillEffect.roll, player);
                t.false(isNaN(testRoll));
            }
        });
    });
});
