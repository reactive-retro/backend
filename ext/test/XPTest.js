
import test from 'ava';

import XPCalculator from '../../src/objects/xpcalculator';

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

test('XP adjustment for killing monsters is correct', t => {
    // same level = no adjustment
    t.true(XPCalculator.calcXPForPerson({
        xpGained: XPCalculator.givenXp({ rating: 0, bonusXp: 0, currentLevel: 1 }),
        player: { currentLevel: 1 },
        levelToAdjustFor: 1
    }) === 13);
    t.true(XPCalculator.calcXPForPerson({
        xpGained: XPCalculator.givenXp({ rating: -2, bonusXp: 0, currentLevel: 1 }),
        player: { currentLevel: 1 },
        levelToAdjustFor: 1
    }) === 7);
    t.true(XPCalculator.calcXPForPerson({
        xpGained: XPCalculator.givenXp({ rating: 5, bonusXp: 0, currentLevel: 1 }),
        player: { currentLevel: 1 },
        levelToAdjustFor: 1
    }) === 28);

    // level reductions
    t.true(XPCalculator.calcXPForPerson({
        xpGained: XPCalculator.givenXp({ rating: 0, bonusXp: 3, currentLevel: 10 }),
        player: { currentLevel: 9 },
        levelToAdjustFor: 10
    }) === 30);

    t.true(XPCalculator.calcXPForPerson({
        xpGained: XPCalculator.givenXp({ rating: 0, bonusXp: 3, currentLevel: 10 }),
        player: { currentLevel: 8 },
        levelToAdjustFor: 10
    }) === 35);

    t.true(XPCalculator.calcXPForPerson({
        xpGained: XPCalculator.givenXp({ rating: 0, bonusXp: 3, currentLevel: 10 }),
        player: { currentLevel: 7 },
        levelToAdjustFor: 10
    }) === 40);

    t.true(XPCalculator.calcXPForPerson({
        xpGained: XPCalculator.givenXp({ rating: 0, bonusXp: 3, currentLevel: 10 }),
        player: { currentLevel: 6 },
        levelToAdjustFor: 10
    }) === 45);

    t.true(XPCalculator.calcXPForPerson({
        xpGained: XPCalculator.givenXp({ rating: 0, bonusXp: 3, currentLevel: 10 }),
        player: { currentLevel: 5 },
        levelToAdjustFor: 10
    }) === 50);

    t.true(XPCalculator.calcXPForPerson({
        xpGained: XPCalculator.givenXp({ rating: 0, bonusXp: 3, currentLevel: 10 }),
        player: { currentLevel: 4 },
        levelToAdjustFor: 10
    }) === 50);

    // level additions
    t.true(XPCalculator.calcXPForPerson({
        xpGained: XPCalculator.givenXp({ rating: 0, bonusXp: 3, currentLevel: 10 }),
        player: { currentLevel: 11 },
        levelToAdjustFor: 10
    }) === 20);

    t.true(XPCalculator.calcXPForPerson({
        xpGained: XPCalculator.givenXp({ rating: 0, bonusXp: 3, currentLevel: 10 }),
        player: { currentLevel: 12 },
        levelToAdjustFor: 10
    }) === 15);

    t.true(XPCalculator.calcXPForPerson({
        xpGained: XPCalculator.givenXp({ rating: 0, bonusXp: 3, currentLevel: 10 }),
        player: { currentLevel: 13 },
        levelToAdjustFor: 10
    }) === 10);

    t.true(XPCalculator.calcXPForPerson({
        xpGained: XPCalculator.givenXp({ rating: 0, bonusXp: 3, currentLevel: 10 }),
        player: { currentLevel: 14 },
        levelToAdjustFor: 10
    }) === 5);

    t.true(XPCalculator.calcXPForPerson({
        xpGained: XPCalculator.givenXp({ rating: 0,  bonusXp: 3, currentLevel: 10 }),
        player: { currentLevel: 15 },
        levelToAdjustFor: 10
    }) === 1);

    t.true(XPCalculator.calcXPForPerson({
        xpGained: XPCalculator.givenXp({ rating: 0, bonusXp: 3, currentLevel: 10 }),
        player: { currentLevel: 16 },
        levelToAdjustFor: 10
    }) === 1);
});

test('XP adjustment for killing monsters (with a party) is correct', t => {

    t.true(XPCalculator.calcXPForPerson({
        xpGained: XPCalculator.givenXp({ rating: 0, bonusXp: 18, currentLevel: 10 }),
        player: { currentLevel: 10 },
        levelToAdjustFor: 10,
        partySizeBonus: 0
    }) === 40);


    t.true(XPCalculator.calcXPForPerson({
        xpGained: XPCalculator.givenXp({ rating: 0, bonusXp: 18, currentLevel: 10 }),
        player: { currentLevel: 10 },
        levelToAdjustFor: 10,
        partySizeBonus: 1
    }) === 45);

    t.true(XPCalculator.calcXPForPerson({
        xpGained: XPCalculator.givenXp({ rating: 0, bonusXp: 18, currentLevel: 10 }),
        player: { currentLevel: 10 },
        levelToAdjustFor: 10,
        partySizeBonus: 2
    }) === 50);

    t.true(XPCalculator.calcXPForPerson({
        xpGained: XPCalculator.givenXp({ rating: 0, bonusXp: 18, currentLevel: 10 }),
        player: { currentLevel: 10 },
        levelToAdjustFor: 10,
        partySizeBonus: 3
    }) === 55);

    t.true(XPCalculator.calcXPForPerson({
        xpGained: XPCalculator.givenXp({ rating: 0, bonusXp: 18, currentLevel: 10 }),
        player: { currentLevel: 10 },
        levelToAdjustFor: 10,
        partySizeBonus: 4
    }) === 60);

    t.true(XPCalculator.calcXPForPerson({
        xpGained: XPCalculator.givenXp({ rating: 0, bonusXp: 18, currentLevel: 10 }),
        player: { currentLevel: 10 },
        levelToAdjustFor: 10,
        partySizeBonus: 5
    }) === 60);

});