
import _ from 'lodash';
import crypto from 'crypto';

import Monster from '../character/base/Monster';

import { weightedChoice } from '../functions/helpers';

const serverSalt = crypto.createHash('md5').update(''+Math.random()).digest('hex');

export default (baseOpts, availableMonsters = []) => {
    const opts = _.clone(baseOpts);

    const chosenMonster = weightedChoice(availableMonsters, opts.seed);

    opts.name = chosenMonster.name;
    opts.profession = chosenMonster.profession;
    opts.professionLevels = { [opts.profession]: opts.baseLevel };

    const monster = new Monster(opts);
    monster.verifyToken = generate(monster);

    return _.pick(monster, ['name', 'profession', 'professionLevels', 'location', 'rating', 'seed', 'verifyToken']);
}

export const generate = (monster) => {
    const props = _.pick(monster, ['name', 'profession', 'professionLevels', 'location', 'rating', 'seed']);
    return crypto.createHash('md5').update(serverSalt + JSON.stringify(props)).digest('hex');
};

export const verify = (monster) => {
    const testToken = generate(monster);
    return testToken === monster.verifyToken;
};