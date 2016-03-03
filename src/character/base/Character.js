
import _ from 'lodash';
import RestrictedNumber from 'restricted-number';
import Dice from 'dice.js';

import SpellEffectManager from '../../objects/spelleffectmanager';

import DEFAULTS from '../../static/chardefaults';
import SETTINGS from '../../static/settings';

export default class Character {
    constructor({ name, profession, professionLevels, unlockedProfessions, stats, skills, inventory, equipment, statusEffects, cooldowns }) {
        this.name = name;
        this.profession = profession;
        this.professionLevels = professionLevels || {};
        this.statusEffects = statusEffects || [];
        this.stats = stats || _.cloneDeep(DEFAULTS.stats);
        this.skills = skills || _.cloneDeep(DEFAULTS.skills);
        this.inventory = inventory || [];
        this.equipment = equipment || DEFAULTS.equipment[this.profession]();
        this.unlockedProfessions = unlockedProfessions || _.cloneDeep(DEFAULTS.unlockedProfessions);
        this.cooldowns = cooldowns || {};

        _.each(this.unlockedProfessions, (prof) => { this.professionLevels[prof] = this.professionLevels[prof] || 1; });

        this.slug = `${this.profession.substring(0, 3).toUpperCase()}-${this.professionLevels[this.profession]}`;
        this.loadStatusEffects();
        this.calculate();
    }

    get currentLevel() {
        return this.professionLevels[this.profession];
    }

    canAddToInventory() {
        return this.inventory.length < SETTINGS.INVENTORY_SIZE;
    }

    addToInventory(item) {
        this.inventory.push(item);
    }

    removeFromInventory(item) {
        _.remove(this.inventory, item);
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
        this.stats.hp = new RestrictedNumber(0, profession.hp(this) * hpMult, this.stats.hp.__current || profession.hp(this) * hpMult);
        this.stats.mp = new RestrictedNumber(0, profession.mp(this), this.stats.mp.__current || profession.mp(this));
    }

    fullheal() {
        this.stats.hp.toMaximum();
        this.stats.mp.toMaximum();
    }
}