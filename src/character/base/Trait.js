
import _ from 'lodash';
import Logger from '../../objects/logger';

export default class Trait {

    constructor() {
        if(_.isUndefined(this.traitName))       Logger.error('Trait:Create', new Error('No trait name set.'), this);
        if(_.isUndefined(this.traitClasses))    Logger.error('Trait:Create', new Error('No trait classes set.'), this);
        if(_.isUndefined(this.traitDescription))Logger.error('Trait:Create', new Error('No trait desc set.'), this);
        if(_.isUndefined(this.traitEffects))    Logger.error('Trait:Create', new Error('No trait effects set.'), this);
        if(_.isUndefined(this.traitFamily))     Logger.error('Trait:Create', new Error('No trait family set.'), this);
    }

    canAffect(skill) {
        return _.contains(skill.spellFamily, this.traitFamily);
    }

    affect(skill) {
        const newSkill = _.cloneDeep(skill);

        _.each(this.traitEffects, (traitEffect, traitKey) => {

            // copy an effect to the skill
            if(traitEffect.effect) {
                if(!newSkill.spellEffects[traitKey]) newSkill.spellEffects[traitKey] = {};
                const thisEffect = traitEffect.effect;
                const copyEffect = newSkill.spellEffects[traitKey];

                if(!copyEffect.chance) copyEffect.chance = 0;
                if(!copyEffect.roll)   copyEffect.roll = '0';
                copyEffect.chance += thisEffect.chance || 0;
                copyEffect.roll   += `+ ${thisEffect.duration || thisEffect.roll || 0}`;

                copyEffect.effectDisplay = thisEffect.effectDisplay;
                copyEffect.ignoreCreation = traitEffect.effect.ignoreCreation;
            }

            if(traitEffect.attachTo && skill.spellEffects[traitEffect.attachTo]) {
                _.extend(skill.spellEffects[traitEffect.attachTo], traitEffect.attachAttr);
            }

            if(!newSkill.traitMods) newSkill.traitMods = {};

            // copy damage to the skill
            // copy hitchance to the skill
            // copy cooldown to the skill
            // copy effect duration to the skill
            // copy mp cost to the skill
            _.each(['damage', 'hitchance', 'cooldown', 'duration', 'cost'], type => {
                if(!traitEffect[type]) return;
                if(!newSkill.traitMods[type]) newSkill.traitMods[type] = { multiplier: 1, boost: 0 };
                const copyDamage = newSkill.traitMods[type];
                copyDamage.multiplier += traitEffect[type].multiplier || 0;
                copyDamage.boost += traitEffect[type].boost || 0;
            });
        });

        return newSkill;
    }

}