
export const name       = (name)     => (target) => { return target.prototype.spellName = name, target; };
export const cost       = (cost)     => (target) => { return target.prototype.spellCost = cost, target; };
export const cooldown   = (cooldown) => (target) => { return target.prototype.spellCooldown = cooldown, target; };
export const classes    = (classes)  => (target) => { return target.prototype.spellClasses = classes, target; };
export const targets    = (targets)  => (target) => { return target.prototype.spellTargets = targets, target; };
export const description= (desc)     => (target) => { return target.prototype.spellDescription = desc, target; };