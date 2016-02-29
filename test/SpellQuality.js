import test from 'ava';
import { allSkills } from '../src/objects/skillmanager';
import Dice from 'dice.js';

const testPlayerStats = {
    str: 1,
    dex: 1,
    mnt: 1,
    vit: 1,
    luk: 1,
    acc: 1,
    hp: { minimum: 0, maximum: 1, __current: 1 },
    mp: { minimum: 0, maximum: 1, __current: 1 }
};

allSkills.forEach(skill => {
    test(`${skill.spellName} dice roll is valid`, t => {
        Object.keys(skill.spellEffects).forEach(key => {
            if(!skill.spellEffects[key].roll) return;

            const result = +Dice.roll(skill.spellEffects[key].roll, testPlayerStats);
            t.false(isNaN(result));

        });

        t.pass();
    })
});