
import _ from 'lodash';
import { readFileSync } from 'fs';
import path from 'path';
import hjson from 'hjson';

export const loadDataFile = (fileName) => hjson.parse(readFileSync(path.join(__dirname, '..', '..', 'data', `${fileName}.hjson`), 'utf8'));

export const longestString = (arr, prop) => {
    const maxRef = _.max(arr, skill => prop ? skill[prop].length : skill);
    return prop ? maxRef[prop].length : maxRef.length;
};

export const startTravis = (category) => {
    console.log(`travis_fold:start:${_.snakeCase(category)}`);
    console.log(`${category}\n`);
};

export const endTravis   = (category) => console.log(`travis_fold:end:${_.snakeCase(category)}`);