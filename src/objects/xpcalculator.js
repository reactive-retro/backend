
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

    static calcXPForPerson({ xpGained, player, levelToAdjustFor, partySizeBonus = 0 }) {
        const levelDifference = levelToAdjustFor - player.currentLevel;

        // anywhere from 0% xp to 200% xp - +-20% per level below/above
        const levelModifier = Math.min(levelDifferenceMax, Math.max(-levelDifferenceMax, levelDifference));
        const xpChange = xpGained * (levelModifier / levelDifferenceMax);

        // +12.5% xp per party member (up to 4 member bonus)
        const clampedPartyBonus = Math.max(0, Math.min(4, partySizeBonus));
        const xpBonus = xpGained * (0.125 * clampedPartyBonus);

        // 1 pity xp
        return Math.floor(Math.max(1, xpGained + xpChange + xpBonus));
    }
}