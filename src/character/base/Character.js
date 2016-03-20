
import _ from 'lodash';
import RestrictedNumber from 'restricted-number';
import Dice from 'dice.js';

import Item from '../../items/Item';
import SkillManager from '../../objects/skillmanager';
import SpellEffectManager from '../../objects/spelleffectmanager';

import DEFAULTS from '../../static/chardefaults';
import SETTINGS from '../../static/settings';

export default class Character {
    constructor({ name, profession, professionLevels, unlockedProfessions, stats, skills, items, inventory, equipment, statusEffects, cooldowns, itemUses }) {
        this.name = name;
        this.profession = profession;
        this.skills = skills;
        this.professionLevels = professionLevels || {};
        this.statusEffects = statusEffects || [];
        this.stats = stats || _.cloneDeep(DEFAULTS.stats);
        this.items = items || [];
        this.itemUses = itemUses;
        this.skills = SkillManager.getValidSkills(this) || _.cloneDeep(DEFAULTS.skills);
        this.inventory = inventory || [];
        this.equipment = equipment || DEFAULTS.equipment[this.profession]();
        this.unlockedProfessions = unlockedProfessions || _.cloneDeep(DEFAULTS.unlockedProfessions);
        this.cooldowns = cooldowns || {};

        this.equipment.weapon = new Item(this.equipment.weapon);
        this.equipment.armor = new Item(this.equipment.armor);
        this.inventory = _.map(this.inventory, i => new Item(i));
        _.each(this.unlockedProfessions, (prof) => { this.professionLevels[prof] = this.professionLevels[prof] || 1; });

        this.slug = `${this.profession.substring(0, 3).toUpperCase()}-${this.professionLevels[this.profession]}`;
        this.loadStatusEffects();
    }

    get currentLevel() {
        return this.professionLevels[this.profession];
    }

    canAddToInventory() {
        return this.inventory.length < SETTINGS.INVENTORY_SIZE;
    }

    addToInventory(item) {
        if(!item) return;
        if(item.quantity) {
            const existingItem = _.find(this.inventory, { name: item.name });
            if(existingItem) {
                existingItem.quantity += item.quantity;
                return;
            }
        }
        this.inventory.push(item);
    }

    removeFromInventory(item) {
        _.remove(this.inventory, item);
    }

    validateItemSlots(item) {
        if(!_.contains(this.items, item.name)) return;
        const numEquipped = _(this.items).filter(itemName => itemName === item.name).size();
        const numAvailable = item.quantity;

        if(numAvailable >= numEquipped) return;
        let unequipCount = numEquipped - numAvailable;

        for(let i = 0; i<this.items.length; i++) {
            if(unequipCount <= 0) return;
            if(this.items[i] === item.name) {
                this.items[i] = null;
                unequipCount -= 1;
            }
        }
    }

    useItem(item) {
        item.quantity -= 1;
        if(item.quantity <= 0) _.remove(this.inventory, { name: item.name });
        this.validateItemSlots(item);
    }

    canSlotItem(item) {
        return _(this.items).filter(itemName => itemName === item.name).size() < item.quantity;
    }

    slotItem(item, slot) {
        this.items[slot] = item ? item.name : null;
    }

    equip(item) {
        this.addToInventory(this.equipment[item.type]);
        this.removeFromInventory(item);
        this.equipment[item.type] = item;
    }

    rollDice(skill, roll) {
        const multiplier = this.calculateMultiplier(skill);
        let result = 0;
        for(let i = 0; i < multiplier; i++) {
            result += +Dice.roll(roll, this.stats);
        }
        return result;
    }

    calculateMultiplier(skill) {
        let baseMultiplier = _.filter(this.skills, check => check === skill).length;
        if(skill === 'Attack') {
            baseMultiplier += 1;
        }
        return baseMultiplier;
    }

    findStatus(status) {
        return _.find(this.statusEffects, { effectName: status });
    }

    removeStatus(status) {
        const item = this.findStatus(status);
        if(!item) return;
        item.unapply(this);
    }

    loadStatusEffects() {
        _.each(this.statusEffects, effect => {
            effect.__proto__ = SpellEffectManager.getEffectByName(effect.effectName).prototype;
        });
    }

    addCooldown(skill, cd) {
        if(!this.cooldowns) this.cooldowns = {};
        if(!this.cooldowns[skill]) this.cooldowns[skill] = 0;

        this.cooldowns[skill] += cd;
    }

    isCoolingDown(skill) {
        return this.cooldowns[skill] > 0;
    }

    lowerAllCooldowns() {
        _.each(this.cooldowns, (val, key) => {
            this.cooldowns[key]--;
        });
    }

    addBuff(stat, val) {
        if(!this.equipment.buffs) this.equipment.buffs = { stats: {} };
        if(!this.equipment.buffs.stats[stat]) this.equipment.buffs.stats[stat] = 0;

        this.equipment.buffs.stats[stat] += val;
        this.calculate();
    }

    subBuff(stat, val) {
        this.equipment.buffs.stats[stat] -= val;
        this.calculate();
    }

    calculate() {

        const profession = require(`../../character/professions/${this.profession}`).default;

        this.equipment.profession = {
            stats: {
                str: profession.str(this),
                mnt: profession.mnt(this),
                dex: profession.dex(this),
                vit: profession.vit(this),
                luk: profession.luk(this),
                acc: profession.acc(this)
            }
        };

        this.equipment.buffs = this.equipment.buffs || { stats: {} };

        _.each(['str', 'mnt', 'dex', 'vit', 'luk', 'acc'], stat => {
            this.stats[stat] = Math.floor(profession.getStat(this, stat));
        });

        const hpMult = this.constructor.name === 'Player' ? 2 : 1;

        const curHp = this.battleId && this.stats.hp.__current === 0 ? 0 : this.stats.hp.__current || profession.hp(this) * hpMult;
        const curMp = this.battleId && this.stats.mp.__current === 0 ? 0 : this.stats.mp.__current || profession.mp(this);
        this.stats.hp = new RestrictedNumber(0, profession.hp(this) * hpMult, curHp);
        this.stats.mp = new RestrictedNumber(0, profession.mp(this), curMp);
    }

    fullheal() {
        this.stats.hp.toMaximum();
        this.stats.mp.toMaximum();
    }
}