
// this makes level 50 require exactly 100k xp
const coefficient = 1.154782;
const baseXp = 100;

const baseEarnedXp = 12;
const earnedXpMultiplier = 3;

const levelDifferenceMax = 5;

export default class XPCalculator {
    static calculate(level) {
        return Math.floor(baseXp * Math.pow(coefficient, level - 1));
    }

    static givenXp(monster) {
        return baseEarnedXp + monster.currentLevel + monster.bonusXp + (monster.rating * earnedXpMultiplier);
    }

    static calcXPForPerson(xpGained, player, levelToAdjustFor) {
        const levelDifference = levelToAdjustFor - player.currentLevel;

        // anywhere from 0% xp to 200% xp - +-20% per level below/above
        const levelModifier = Math.min(levelDifferenceMax, Math.max(-levelDifferenceMax, levelDifference));
        const xpChange = xpGained * (levelModifier / levelDifferenceMax);

        // 1 pity xp
        return Math.max(1, xpGained + xpChange);
    }
}