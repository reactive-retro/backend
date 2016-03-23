
import _ from 'lodash';

import { allProfessions } from '../../src/objects/professionmanager';

import { longestString, startTravis, endTravis } from '../test/_helpers';

const padSize = longestString(_.values(allProfessions), 'name');


startTravis('Profession Learning Analysis');
console.log(`Total professions: (${_.keys(allProfessions).length})`);

_.each(_.values(allProfessions), profession => {

    const preReqString = profession.prerequisites ? _(profession.prerequisites).keys().map(name => `${name}: ${profession.prerequisites[name]}`).value().join(', ') : 'No prerequisite';
    console.log(`${_.padRight(profession.name, padSize)}\t${preReqString}`);
});

endTravis('Profession Learning Analysis');