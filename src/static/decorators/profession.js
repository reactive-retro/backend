
const statPerLevel = (stat, val, bonus = () => 0) => (target) => {
    target[stat] = (player) => Math.floor(player.currentLevel * val + bonus(target, player));
    return target;
};

export const hp  = statPerLevel.bind(null, 'hp');
export const mp  = statPerLevel.bind(null, 'mp');
export const str = statPerLevel.bind(null, 'str');
export const dex = statPerLevel.bind(null, 'dex');
export const vit = statPerLevel.bind(null, 'vit');
export const mnt = statPerLevel.bind(null, 'mnt');
export const luk = statPerLevel.bind(null, 'luk');
export const acc = statPerLevel.bind(null, 'acc');

export const prerequisite = (prereqs) => (target) => { return target.prerequisites = prereqs, target; };
export const description  = (desc) => (target) => { return target.description = desc, target; };