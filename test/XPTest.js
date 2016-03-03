
import test from 'ava';

import XPCalculator from '../src/objects/xpcalculator';

test('XP needed for level 2 = 100 XP', t => {
    t.true(XPCalculator.calculate(1) === 100);
});

test('XP needed for level 50 = 100000 XP', t => {
    t.true(XPCalculator.calculate(49) === 100000);
});

test('XP gained for killing monsters is correct', t => {
    t.true(XPCalculator.givenXp({ rating: 0,  bonusXp: 0, currentLevel: 1 }) === 13);
    t.true(XPCalculator.givenXp({ rating: -2, bonusXp: 0, currentLevel: 1 }) === 7);
    t.true(XPCalculator.givenXp({ rating: 5,  bonusXp: 0, currentLevel: 1 }) === 28);

    t.true(XPCalculator.givenXp({ rating: 0,  bonusXp: 0, currentLevel: 10 }) === 22);
    t.true(XPCalculator.givenXp({ rating: -2, bonusXp: 0, currentLevel: 10 }) === 16);
    t.true(XPCalculator.givenXp({ rating: 5,  bonusXp: 0, currentLevel: 10 }) === 37);

    t.true(XPCalculator.givenXp({ rating: 0,  bonusXp: 5, currentLevel: 10 }) === 27);
    t.true(XPCalculator.givenXp({ rating: -2, bonusXp: 5, currentLevel: 10 }) === 21);
    t.true(XPCalculator.givenXp({ rating: 5,  bonusXp: 5, currentLevel: 10 }) === 42);
});