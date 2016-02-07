
import _ from 'lodash';
import RestrictedNumber from 'restricted-number';

import DEFAULTS from '../../static/chardefaults';

export default class Character {
    constructor({ name, profession, professionLevels, unlockedProfessions, stats, skills, inventory, equipment }) {
        this.name = name;
        this.profession = profession;
        this.professionLevels = professionLevels || {};
        this.stats = stats || DEFAULTS.stats;
        this.skills = skills || [];
        this.inventory = inventory || [];
        this.equipment = equipment || DEFAULTS.equipment[this.profession]();
        this.unlockedProfessions = unlockedProfessions || DEFAULTS.unlockedProfessions;

        _.each(this.unlockedProfessions, (prof) => { this.professionLevels[prof] = this.professionLevels[prof] || 1; });
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
                luk: profession.luk(this)
            }
        };

        _.each(['str', 'mnt', 'dex', 'vit', 'luk'], stat => {
            this.stats[stat] = Math.floor(profession.getStat(this, stat));
        });

        this.stats.hp = new RestrictedNumber(0, profession.hp(this), this.stats.hp.__current || 0);
        this.stats.mp = new RestrictedNumber(0, profession.mp(this), this.stats.mp.__current || 0);
        this.stats.xp = new RestrictedNumber(0, this.stats.xp.maximum || 100, this.stats.xp.__current || 0);
    }

    fullheal() {
        const profession = require(`../../character/professions/${this.profession}`).default;
        this.stats.hp.toMaximum();
        this.stats.mp.toMaximum();
    }
}