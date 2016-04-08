
import _ from 'lodash';

import { itemId as newItemId } from '../functions/helpers';

export default class Item {
    constructor({ name, isDefault, levelRequirement, quality, quantity, itemId, effects, dropRate, value, seed, numMods, stats = {}, type, description }) {
        this.itemId = itemId || newItemId(seed);
        this.name = name;
        this.isDefault = isDefault;
        this.stats = stats;
        this.numMods = numMods || 0;
        this.levelRequirement = levelRequirement ? Math.max(1, levelRequirement) : 1;
        this.quality = quality || 0;
        this.value = value || this.calcValue();
        this.quantity = quantity || 0;
        this.dropRate = dropRate || 1;
        this.effects = effects || [];
        this.type = type;
        this.description = description;
        this.setMaxMods();

        if(_.isNaN(this.levelRequirement)) this.levelRequirement = 1;
    }

    setMaxMods() {
        if(!_.contains(['weapon', 'armor'], this.type)) return;
        this.maxMods = ((Math.floor(this.levelRequirement / 5) * 5) / 5);
    }

    canMod() {
        return this.numMods < this.maxMods;
    }

    calcModCost(material) {
        return material.value + Math.floor(this.value / (this.numMods + 1));
    }

    doMod(material) {
        _.each(_.keys(material.stats), stat => {
            this.stats[stat] = this.stats[stat] || 0;
            this.stats[stat] += material.stats[stat];
        });
        this.numMods++;
        this.value = this.calcValue();
    }

    calcValue() {
        const baseValue = (this.stats.str || 0) * 3
                        + (this.stats.dex || 0) * 2
                        + (this.stats.mnt || 0) * 3
                        + (this.stats.vit || 0) * 4
                        + (this.stats.luk || 0) * 6
                        + (this.stats.acc || 0) * 3;

        return Math.max(1, (this.quality+1) * baseValue);
    }
}