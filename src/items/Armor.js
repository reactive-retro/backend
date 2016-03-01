
import Item from './Item';

export default class Armor extends Item {
    constructor(opts) {
        super(opts);

        this.type = 'armor';
    }
}