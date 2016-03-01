
import Item from './Item';

export default class Weapon extends Item {
    constructor(opts) {
        super(opts);

        this.type = 'weapon';
    }
}