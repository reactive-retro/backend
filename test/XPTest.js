
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

test('XP adjustment for killing monsters (whilst partied) is correct', t => {
    // same level = no adjustment
    t.true(XPCalculator.calcXPForPerson(
            XPCalculator.givenXp({ rating: 0,  bonusXp: 0, currentLevel: 1 }),
            { currentLevel: 1 },
            1
        ) === 13);
    t.true(XPCalculator.calcXPForPerson(
            XPCalculator.givenXp({ rating: -2, bonusXp: 0, currentLevel: 1 }),
            { currentLevel: 1 },
            1
        ) === 7);
    t.true(XPCalculator.calcXPForPerson(
            XPCalculator.givenXp({ rating: 5,  bonusXp: 0, currentLevel: 1 }),
            { currentLevel: 1 },
            1
        ) === 28);

    // level reductions
    t.true(XPCalculator.calcXPForPerson(
            XPCalculator.givenXp({ rating: 0,  bonusXp: 3, currentLevel: 10 }),
            { currentLevel: 9 },
            10
        ) === 30);

    t.true(XPCalculator.calcXPForPerson(
            XPCalculator.givenXp({ rating: 0,  bonusXp: 3, currentLevel: 10 }),
            { currentLevel: 8 },
            10
        ) === 35);

    t.true(XPCalculator.calcXPForPerson(
            XPCalculator.givenXp({ rating: 0,  bonusXp: 3, currentLevel: 10 }),
            { currentLevel: 7 },
            10
        ) === 40);

    t.true(XPCalculator.calcXPForPerson(
            XPCalculator.givenXp({ rating: 0,  bonusXp: 3, currentLevel: 10 }),
            { currentLevel: 6 },
            10
        ) === 45);

    t.true(XPCalculator.calcXPForPerson(
            XPCalculator.givenXp({ rating: 0,  bonusXp: 3, currentLevel: 10 }),
            { currentLevel: 5 },
            10
        ) === 50);

    t.true(XPCalculator.calcXPForPerson(
            XPCalculator.givenXp({ rating: 0,  bonusXp: 3, currentLevel: 10 }),
            { currentLevel: 4 },
            10
        ) === 50);

    // level additions
    t.true(XPCalculator.calcXPForPerson(
            XPCalculator.givenXp({ rating: 0,  bonusXp: 3, currentLevel: 10 }),
            { currentLevel: 11 },
            10
        ) === 20);

    t.true(XPCalculator.calcXPForPerson(
            XPCalculator.givenXp({ rating: 0,  bonusXp: 3, currentLevel: 10 }),
            { currentLevel: 12 },
            10
        ) === 15);

    t.true(XPCalculator.calcXPForPerson(
            XPCalculator.givenXp({ rating: 0,  bonusXp: 3, currentLevel: 10 }),
            { currentLevel: 13 },
            10
        ) === 10);

    t.true(XPCalculator.calcXPForPerson(
            XPCalculator.givenXp({ rating: 0,  bonusXp: 3, currentLevel: 10 }),
            { currentLevel: 14 },
            10
        ) === 5);

    t.true(XPCalculator.calcXPForPerson(
            XPCalculator.givenXp({ rating: 0,  bonusXp: 3, currentLevel: 10 }),
            { currentLevel: 15 },
            10
        ) === 1);

    t.true(XPCalculator.calcXPForPerson(
            XPCalculator.givenXp({ rating: 0,  bonusXp: 3, currentLevel: 10 }),
            { currentLevel: 16 },
            10
        ) === 1);
});