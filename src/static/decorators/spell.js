
export const name       = (name)     => (target) => { return target.prototype.spellName = name, target; };
export const cost       = (cost)     => (target) => { return target.prototype.spellCost = cost, target; };
export const cooldown   = (cooldown) => (target) => { return target.prototype.spellCooldown = cooldown, target; };
export const classes    = (classes)  => (target) => { return target.prototype.spellClasses = classes, target; };
export const targets    = (targets)  => (target) => { return target.prototype.spellTargets = targets, target; };
export const description= (desc)     => (target) => { return target.prototype.spellDescription = desc, target; };
export const useString  = (useStr)   => (target) => { return target.prototype.spellUseString = useStr, target; };
export const disabled   =               (target) => { return target.prototype.spellDisabled = true, target; };
export const unblockable=               (target) => { return target.prototype.spellUnblockable = true, target; };
export const unstackable=               (target) => { return target.prototype.spellUnstackable = true, target; };

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