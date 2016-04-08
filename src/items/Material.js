
import Item from './Item';

export default class Material extends Item {
    constructor(opts) {
        super(opts);

        this.type = 'material';
        this.quantity = opts.quantity || 1;
    }
}