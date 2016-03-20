
import { readFileSync } from 'fs';
import path from 'path';
import hjson from 'hjson';

export const loadDataFile = (fileName) => hjson.parse(readFileSync(path.join(__dirname, '..', '..', 'data', `${fileName}.hjson`), 'utf8'));