
export const name       = (name)     => (target) => { return target.prototype.spellName = name, target; };
export const cost       = (cost)     => (target) => { return target.prototype.spellCost = cost, target; };
export const cooldown   = (cooldown) => (target) => { return target.prototype.spellCooldown = cooldown, target; };
export const classes    = (classes)  => (target) => { return target.prototype.spellClasses = classes, target; };
export const targets    = (targets)  => (target) => { return target.prototype.spellTargets = targets, target; };
export const description= (desc)     => (target) => { return target.prototype.spellDescription = desc, target; };
export const useString  = (useStr)   => (target) => { return target.prototype.spellUseString = useStr, target; };

export const effect     = (effect, effVal) => (target) => {
    if(!target.prototype.spellEffects) {
        target.prototype.spellEffects = {};
    }

    if(!effVal.chance) {
        effVal.chance = 100;
    }

    target.prototype.spellEffects[effect] = effVal;
    return target;
};

const statPerLevel = (stat, val, bonus = () => 0) => (target) => {
    target[stat] = (player) => target.getLevel(player) * val + bonus(target, player);
    return target;
};

export const hp  = statPerLevel.bind(null, 'hp');
export const mp  = statPerLevel.bind(null, 'mp');
export const str = statPerLevel.bind(null, 'str');
export const dex = statPerLevel.bind(null, 'dex');
export const vit = statPerLevel.bind(null, 'vit');
export const mnt = statPerLevel.bind(null, 'mnt');
export const luk = statPerLevel.bind(null, 'luk');