
import _ from 'lodash';

import Monster from '../character/base/Monster';

export default (baseOpts) => {
    const opts = _.clone(baseOpts);

    opts.name = 'Goblin';
    opts.rating = 1;

    return new Monster(opts);
}