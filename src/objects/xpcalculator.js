
const coefficient = 1.154782;
const baseXp = 100;

const baseEarnedXp = 12;
const earnedXpMultiplier = 3;

export default class XPCalculator {
    static calculate(level) {
        return Math.floor(baseXp * Math.pow(coefficient, level - 1));
    }

    static givenXp(monster) {
        return baseEarnedXp + monster.currentLevel + monster.bonusXp + (monster.rating * earnedXpMultiplier);
    }
}