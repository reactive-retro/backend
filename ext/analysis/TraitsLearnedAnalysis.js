
import _ from 'lodash';

import { allTraits } from '../../src/objects/traitmanager';
const allProfessions = _.keys(require('require-dir')('../../src/character/professions'));

import { longestString, startTravis, endTravis } from '../test/_helpers';

startTravis('Trait Learning Analysis');

_.each(allProfessions, profession => {

    const traitsLearned = _(allTraits)
        .filter(trait => trait.traitClasses[profession])
        .sortBy(trait => trait.traitClasses[profession])
        .value();

    console.log(`${profession} Traits (${traitsLearned.length} total)`);

    if(!traitsLearned.length) {
        return console.log('No traits for this class.\n');
    }

    const padSize = longestString(traitsLearned, 'traitName');

    _.each(traitsLearned, trait => {
        console.log(`${_.padRight(trait.traitName, padSize)}\tLevel ${_.padRight(trait.traitClasses[profession], 2)}\t${trait.traitDescription}`);
    });

    console.log();
});

endTravis('Trait Learning Analysis');