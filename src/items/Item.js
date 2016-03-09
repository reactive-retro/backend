
import { itemId as newItemId } from '../functions/helpers';

export default class Item {
    constructor({ name, isDefault, levelRequirement, quality, itemId, seed, stats = {} }) {
        this.itemId = itemId || newItemId(seed);
        this.name = name;
        this.isDefault = isDefault;
        this.stats = stats;
        this.levelRequirement = levelRequirement ? Math.max(1, levelRequirement) : 1;
        this.quality = quality || 0;
        this.value = this.calcValue();
    }

    calcValue() {
        const baseValue = (this.stats.str || 0) * 3
                        + (this.stats.dex || 0) * 2
                        + (this.stats.mnt || 0) * 3
                        + (this.stats.vit || 0) * 4
                        + (this.stats.luk || 0) * 6
                        + (this.stats.acc || 0) * 5;

        return (this.quality+1) * baseValue;
    }
}