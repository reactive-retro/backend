
import _ from 'lodash';
import seedrandom from 'seedrandom';

import SETTINGS from '../static/settings';
import Logger from '../objects/logger';

import Weapon from '../items/Weapon';
import Armor from '../items/Armor';
import Consumable from '../items/Consumable';
import Material from '../items/Material';

import dbPromise from './db';
import { weightedChoice } from '../functions/helpers';

const QUALITY = [
    { tier: -1, name: 'Trash',        weight: -1000, minLevel: 0  },
    { tier: 0,  name: 'Basic',        weight: 40,    minLevel: 0  },
    { tier: 1,  name: 'Common',       weight: 17,    minLevel: 0  },
    { tier: 2,  name: 'Uncommon',     weight: 10,    minLevel: 3  },
    { tier: 3,  name: 'Rare',         weight: 1,     minLevel: 10 },
    { tier: 4,  name: 'Epic',         weight: -20,   minLevel: 25 },
    { tier: 10, name: 'Legendary',    weight: -100,  minLevel: 50 }
];

const ITEM_TYPES = [
    { name: 'weapon', weight: 4 },
    { name: 'armor', weight: 4 },
    { name: 'consumable', weight: 1 }
];

const determineBaseQuality = (playerLevel, luckBonus = 0, seed = Date.now(), baseTier = 0) => {
    const adjustedQualities = _.cloneDeep(QUALITY);
    _.each(adjustedQualities, q => q.weight += luckBonus);

    baseTier = Math.min(10, baseTier);
    const choices = _.reject(adjustedQualities, q => q.tier < baseTier);

    // if some weird case happens, generate a basic item
    let choice = weightedChoice(choices, seed);
    if(!choice) {
        Logger.error('ItemGenerator:QualityChoice', new Error('Quality choice was not correct'), {
            playerLevel, luckBonus, seed, baseTier
        });
        choice = QUALITY[1];
    }

    return choice;
};

const getProto = (type) => {
    switch(type) {
        case 'armor': return Armor;
        case 'weapon': return Weapon;
        case 'consumable': return Consumable;
        case 'material': return Material;
    }
};

export default class ItemGenerator {

    static async loadType(type) {
        const db = await dbPromise();
        const collection = db.collection(`item.${type}Data`);
        return new Promise((resolve, reject) => {

            // find the lowest item id
            collection.findOne({}, { sort: { _id: 1 }, limit: 1 }, (err, minRes) => {
                if(err) return reject(err);
                const min = minRes._id;

                // find the highest item id
                collection.findOne({}, { sort: { _id: -1 }, limit: 1 }, (err, maxRes) => {
                    if(err) return reject(err);
                    const max = maxRes._id;

                    resolve({ type, min, max, diff: max - min });
                });
            });
        });
    }

    static init() {
        const typesToLoad = ['armor', 'weapon', 'consumable', 'attribute', 'material', 'prefix', 'suffix', 'zone'];
        this.typeData = _.map(typesToLoad, this.loadType);
    }

    static mergeItemStats(myStats, newStats) {
        _.each(_.keys(newStats), stat => {
            if(!myStats[stat]) myStats[stat] = 0;
            myStats[stat] += newStats[stat];
        });
        return myStats;
    }

    static rollCheck(dice, luckBonus, rng) {
        return Math.floor(rng() * dice) <= 1 + luckBonus;
    }

    static async generate({ playerReference, type, itemName, seed, minQuality = 0 }) {

        const luckBonus = playerReference.stats.luk;

        const rng = seedrandom(seed);
        if(!type) type = weightedChoice(ITEM_TYPES, seed).name;

        const isGear = _.contains(['weapon', 'armor'], type);

        let baseItemQuality = null;
        if(isGear) {
            baseItemQuality = determineBaseQuality(playerReference.currentLevel, luckBonus, seed, minQuality);
        } else {

            // all consumables are created equally
            baseItemQuality = _.find(QUALITY, { tier: 0 });
        }

        const baseSearch = {
            weight: { $gt: 0 },
            minLevel: { $lte: playerReference.currentLevel },
            baseQuality: { $lte: baseItemQuality.tier }
        };

        if(itemName) {
            baseSearch.name = itemName;
        }

        if(isGear) {
            baseSearch.minLevel.$gte = playerReference.currentLevel - 7;
        }

        let item = null;

        while(item === null) {
            item = await this.getRandom(type, baseSearch, rng);
        }

        baseItemQuality.tier += item.qualityMod || 0;

        const extraValidity = { minLevel: { $lte: playerReference.currentLevel } };

        let attributeMaxDice = 20;
        let currentQuality = 0;
        let currentLevelRequirement = item.minLevel;

        const chosenAttrs = [];

        const canHaveAttrs = () => {
            return !_.contains(['consumable', 'material'], type);
        };

        const canChooseMoreAttrs = () => {

                    // uncommon items get 1 guaranteed prefix
            return (chosenAttrs.length < 1 && baseItemQuality.tier > 1) ||

                    // epic items get 2 guaranteed prefixes
                   (chosenAttrs.length < 2 && baseItemQuality.tier > 3) ||

                    // legendary items get 3 guaranteed prefixes
                   (chosenAttrs.length < 3 && baseItemQuality.tier > 9);
        };

        while(canHaveAttrs() && (canChooseMoreAttrs() || this.rollCheck(attributeMaxDice, luckBonus, rng))) {

            // 10 times harder to roll subsequent attributes
            attributeMaxDice *= 10;

            // no getting the same attribute twice
            const validityCheck = _.cloneDeep(extraValidity);
            validityCheck.name = { $nin: chosenAttrs };

            const attribute = await this.getRandom('attribute', validityCheck, rng);
            item.stats = this.mergeItemStats(item.stats, attribute.stats);
            item.name = `${attribute.name} ${item.name}`;
            chosenAttrs.push(attribute.name);
            currentQuality += 1;
            currentLevelRequirement += attribute.levelMod || 0;
        }

        if(canHaveAttrs() && (baseItemQuality.tier > 2 || this.rollCheck(100, luckBonus, rng))) {
            const prefix = await this.getRandom('prefix', extraValidity, rng);
            item.stats = this.mergeItemStats(item.stats, prefix.stats);
            item.name = `${prefix.name} ${item.name}`;
            currentQuality += 1;
            currentLevelRequirement += prefix.levelMod || 0;
        }

        if(canHaveAttrs() && (baseItemQuality.tier > 3 || this.rollCheck(100, luckBonus, rng))) {
            const suffix = await this.getRandom('suffix', extraValidity, rng);
            item.stats = this.mergeItemStats(item.stats, suffix.stats);
            item.name = `${item.name} ${suffix.name}`;
            currentQuality += 1;
            currentLevelRequirement += suffix.levelMod || 0;
        }

        // set the quality to whatever was generated
        item.quality = currentQuality;
        item.levelRequirement = canHaveAttrs() ? Math.min(SETTINGS.MAX_LEVEL, currentLevelRequirement) : item.minLevel;
        item.seed = seed;
        const constructedItem = new (getProto(type))(item);

        return constructedItem;
    }

    static async getRandom(type, extraFilter = {}, rng = Math.random) {
        const db = await dbPromise();
        const itemData = db.collection(`item.${type}Data`);

        const typeData = await Promise.all(this.typeData);
        const { diff } = _.find(typeData, { type });

        const _id = Math.floor(rng() * diff);

        return new Promise((resolve, reject) => {
            const filter = _.extend(type === 'material' ? {} : { _id: { $gte: _id } }, extraFilter);
            itemData.findOne(
                filter,
                { sort: { _id: 1 }, limit: 1 },
                (err, item) => {
                    if(err) return reject(err);
                    resolve(item);
                });
        });
    }
}