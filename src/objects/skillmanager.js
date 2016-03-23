
import _ from 'lodash';

import { ActionTypes, ActionTargets } from '../character/base/Action';

const skillsHash = require('require-dir')('../character/spells', { recurse: true });
const skills = _(skillsHash)
    .values()
    .map(skills => {
        return _(skills)
            .values()
            .pluck('default')
            .map(x => x.prototype)
            .each(spell => {
                if(_.isUndefined(spell.spellAICallback)) spell.spellAICallback = (targets) => _.sample(targets);
                if(_.isUndefined(spell.spellTimes))      spell.spellTimes = 1;
                if(_.contains([ActionTargets.ALL, ActionTargets.ALL_ALLY, ActionTargets.ALL_ENEMY], spell.spellTargets)) {
                    spell.spellFamily.push(ActionTypes.AOE);
                } else {
                    spell.spellFamily.push(ActionTypes.SINGLE);
                }
                spell.spellFamily.push(spell.spellName);

                if(spell.spellEffects.Damage) {
                    spell.spellFamily.push('Damage');
                }
            })
            .value();
    })
    .flatten()
    .value();

const skillNames = _.pluck(skills, 'spellName');

export const allSkills = skills;

export default class SkillManager {

    static isSkillDisabled(skill) {
        return _.find(skills, { spellName: skill, spellDisabled: true });
    }

    static isSkillUnstackable(skill) {
        return _.find(skills, { spellName: skill, spellUnstackable: true });
    }

    static doesSkillExist(skill) {
        return _.contains(skillNames, skill);
    }

    static getSkillsThatDontExist(player) {
        const disabledSkills = _.filter(player.skills, this.isSkillDisabled);
        return _.difference(player.skills, skillNames).concat(disabledSkills);
    }

    static getValidSkills(player) {
        const validSkills = this.getSkills(player);
        const allValidSkills = _.map(validSkills, 'spellName');
        return _.map(player.skills, skillName => _.contains(allValidSkills, skillName) ? skillName : null);
    }

    static getSkillsAtLevel(player) {
        return _.filter(skills, skill => {
            return skill.spellClasses[player.profession] === player.currentLevel;
        });
    }

    static getSkills(player) {
        return _(skills)
            .filter(skill => {
                return _(skill.spellClasses)
                    .keys()
                    .any(profession => {

                        if(profession === 'All' && player.professionLevels[player.profession] >= skill.spellClasses.All) {
                            return true;
                        }

                        // you need to be level x*2 to use a skill outside of a profession.
                        // some skills will not translate, as a result
                        let multiplier = 2;
                        if(player.profession === profession) {
                            multiplier = 1;
                        }
                        return player.professionLevels[profession] >= skill.spellClasses[profession]*multiplier;
                    });
            })
            .value();
    }

    static getCombatSkills(player, skills = this.getSkills(player)) {
        return _(skills)
            .compact()
            .reject(skill => skill.spellDisabled)
            .reject(skill => player.stats.mp.lessThan(skill.spellCost * player.calculateMultiplier(skill.spellName)))
            .reject(skill => player.isCoolingDown(skill.spellName))
            .value();
    }
}