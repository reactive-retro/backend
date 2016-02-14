
import _ from 'lodash';

const skillsHash = require('require-dir')('../character/spells', { recurse: true });
const skills = _(skillsHash)
    .values()
    .map(skills => {
        return _(skills)
            .values()
            .pluck('default')
            .map(x => x.prototype)
            .value();
    })
    .flatten()
    .value();

const skillNames = _.pluck(skills, 'spellName');

export default class SkillManager {

    static isSkillDisabled(skill) {
        return _.find(skills, { spellName: skill, spellDisabled: true });
    }

    static doesSkillExist(skill) {
        return _.contains(skillNames, skill);
    }

    static getSkillsThatDontExist(player) {
        const disabledSkills = _.filter(player.skills, this.isSkillDisabled);
        return _.difference(player.skills, skillNames).concat(disabledSkills);
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
}