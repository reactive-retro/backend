
import _ from 'lodash';

const skillsHash = require('require-dir')('../character/spells', { recurse: true });
const skills = _(skillsHash)
    .values()
    .map(skills => {
        return _(skills)
            .values()
            .pluck('default')
            .value();
    })
    .flatten()
    .value();

export default class SkillManager {
    static getSkills(player) {
        return _(skills)
            .map(skill => skill.prototype)
            .filter(skill => {
                return _(skill.spellClasses)
                    .keys()
                    .any(profession => {

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