
import { itemId } from '../functions/helpers';

export default class Item {
    constructor({ name, isDefault, stats = {} }) {
        this.itemId = itemId();
        this.name = name;
        this.isDefault = isDefault;
        this.stats = stats;
    }
}