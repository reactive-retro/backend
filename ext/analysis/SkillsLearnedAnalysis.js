
import _ from 'lodash';

import { allSkills } from '../../src/objects/skillmanager';
const allProfessions = _.keys(require('require-dir')('../../src/character/professions'));

import { longestString, startTravis, endTravis } from '../test/_helpers';

startTravis('Skill Learning Analysis');

_.each(allProfessions, profession => {

    const skillsLearned = _(allSkills)
        .filter(skill => skill.spellClasses[profession])
        .sortBy(skill => skill.spellClasses[profession])
        .value();

    console.log(`${profession} Skills (${skillsLearned.length} total)`);

    if(!skillsLearned.length) {
        return console.log('No skills for this class.\n');
    }

    const padSize = longestString(skillsLearned, 'spellName');

    _.each(skillsLearned, skill => {
        console.log(`${_.padRight(skill.spellName, padSize)}\tLevel ${_.padRight(skill.spellClasses[profession], 2)}\t${skill.spellDescription}`);
    });

    console.log();
});

endTravis('Skill Learning Analysis');