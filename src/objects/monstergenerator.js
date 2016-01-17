
import _ from 'lodash';
import crypto from 'crypto';

import Monster from '../character/base/Monster';

const serverSalt = crypto.createHash('md5').update(Math.random()).digest('hex');

export default (baseOpts) => {
    const opts = _.clone(baseOpts);

    opts.name = 'Goblin';
    opts.rating = 1;

    opts.verifyToken = generate(monster);

    return new Monster(opts);
}

export const generate = (monster) => {
    const props = _.pick(monster, ['name', 'profession', 'location', 'rating', 'seed']);
    return crypto.createHash('md5').update(serverSalt + JSON.stringify(props)).digest('hex');
};

export const verify = (monster) => {
    const testToken = generate(monster);
    return testToken === monster.verifyToken;
};