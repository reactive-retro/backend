
import _ from 'lodash';
import crypto from 'crypto';

import Monster from '../character/base/Monster';

const serverSalt = crypto.createHash('md5').update(''+Math.random()).digest('hex');

export default (baseOpts) => {
    const opts = _.clone(baseOpts);

    opts.name = 'Goblin';
    opts.rating = 1;
    opts.profession = 'Monster';
    opts.professionLevels = { Monster: 1 };

    opts.verifyToken = generate(opts);

    return new Monster(opts);
}

export const generate = (monster) => {
    const props = _.pick(monster, ['name', 'profession', 'professionLevels', 'location', 'rating', 'seed']);
    return crypto.createHash('md5').update(serverSalt + JSON.stringify(props)).digest('hex');
};

export const verify = (monster) => {
    console.log(monster);
    const testToken = generate(monster);
    return testToken === monster.verifyToken;
};