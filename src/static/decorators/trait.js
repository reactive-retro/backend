
export const name       = (name)     => (target) => { return target.prototype.traitName = name, target; };
export const classes    = (classes)  => (target) => { return target.prototype.traitClasses = classes, target; };
export const description= (desc)     => (target) => { return target.prototype.traitDescription = desc, target; };
export const disabled   =               (target) => { return target.prototype.traitDisabled = true, target; };
export const family     = (name)     => (target) => { return target.prototype.traitFamily = name, target; };

export const effect     = (effect, effVal) => (target) => {
    if(!target.prototype.traitEffects) {
        target.prototype.traitEffects = {};
    }

    target.prototype.traitEffects[effect] = effVal;
    return target;
};