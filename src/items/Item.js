
import { itemId } from '../functions/helpers';

export default class Item {
    constructor({ name, isDefault, levelRequirement, quality, stats = {} }) {
        this.itemId = itemId();
        this.name = name;
        this.isDefault = isDefault;
        this.stats = stats;
        this.levelRequirement = Math.max(1, levelRequirement);
        this.quality = quality || 0;
    }
}