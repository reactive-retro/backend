
import _ from 'lodash';

export default class Action {

    constructor() {
        if(_.isUndefined(this.spellName))       console.error('No spell name set.', this);
        if(_.isUndefined(this.spellCost))       console.error('No spell cost set.', this);
        if(_.isUndefined(this.spellCooldown))   console.error('No spell cooldown set.', this);
        if(_.isUndefined(this.spellClasses))    console.error('No spell classes set.', this);
        if(_.isUndefined(this.spellDescription))console.error('No spell desc set.', this);
        if(_.isUndefined(this.spellUseString))  console.error('No spell use string set.', this);
    }

}

export const ActionTargets = {
    SELF: 'Self',
    SINGLE_ENEMY: 'Single Enemy',
    SINGLE_ALLY: 'Single Ally',
    ALL_ENEMY: 'All Enemies',
    ALL_ALLY: 'All Allies',
    ALL: 'All'
};