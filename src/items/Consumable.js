
import Item from './Item';

export default class Consumable extends Item {
    constructor(opts) {
        super(opts);

        this.type = 'consumable';
        this.quantity = opts.quantity || 1;
    }
}