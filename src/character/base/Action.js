
import _ from 'lodash';

export default class Action {

    constructor() {
        if(_.isUndefined(this.spellName))       console.error('No spell name set.', this);
        if(_.isUndefined(this.spellCost))       console.error('No spell cost set.', this);
        if(_.isUndefined(this.spellCooldown))   console.error('No spell cooldown set.', this);
        if(_.isUndefined(this.spellClasses))    console.error('No spell classes set.', this);
    }

    clientInfo() {
        return {
            name: this.spellName,
            cooldown: this.spellCooldown,
            cost: this.spellCost
        };
    }

}

export const ActionTargets = {
    SINGLE_ENEMY: 'Single Enemy',
    SINGLE_ALLY: 'Single Ally',
    ALL_ENEMY: 'All Enemies',
    ALL_ALLY: 'All Allies',
    ALL: 'All'
};