
import _ from 'lodash';
import Logger from '../../objects/logger';

export default class Action {

    constructor() {
        if(_.isUndefined(this.spellName))       Logger.error('Action:Create', new Error('No spell name set.'), this);
        if(_.isUndefined(this.spellCost))       Logger.error('Action:Create', new Error('No spell cost set.'), this);
        if(_.isUndefined(this.spellCooldown))   Logger.error('Action:Create', new Error('No spell cooldown set.'), this);
        if(_.isUndefined(this.spellClasses))    Logger.error('Action:Create', new Error('No spell classes set.'), this);
        if(_.isUndefined(this.spellDescription))Logger.error('Action:Create', new Error('No spell desc set.'), this);
        if(_.isUndefined(this.spellUseString))  Logger.error('Action:Create', new Error('No spell use string set.'), this);
        if(_.isUndefined(this.spellFamily))     Logger.error('Action:Create', new Error('No spell family set.'), this);
    }

}

export const ActionTargets = {
    SELF: 'Self',
    SINGLE_ENEMY: 'Single Enemy',
    SINGLE_ALLY: 'Single Ally',
    ALL_ENEMY: 'All Enemies',
    ALL_ALLY: 'All Allies',
    ALL: 'All',
    ANY: 'Any'
};

export const ActionTypes = {
    HEAL: 'Heal',
    HOLY: 'Holy',
    FIRE: 'Fire',
    ICE: 'Ice',
    ELECTRIC: 'Electric',
    PHYSICAL: 'Physical',

    AOE: 'Area of Effect',
    SINGLE: 'Single Target',

    BUFF: 'Buff',
    DEBUFF: 'Debuff',

    SPECIAL: 'Special',
    NONE: 'None'
};