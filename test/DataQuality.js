
import test from 'ava';

import { readFileSync } from 'fs';
import path from 'path';
import hjson from 'hjson';

test('Monster data is valid', t => {

    hjson.parse(readFileSync(path.join(__dirname, '..', 'data', 'monsters.hjson'), 'utf8'));
    t.pass();
});