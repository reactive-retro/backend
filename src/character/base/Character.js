
import _ from 'lodash';

import DEFAULTS from '../../static/chardefaults';

export default class Character {
    constructor({ name, profession, professionLevels, stats, skills, inventory, equipment }) {
        this.name = name;
        this.profession = profession;
        this.professionLevels = professionLevels || {};
        this.stats = stats || DEFAULTS.stats;
        this.skills = skills || [];
        this.inventory = inventory || [];
        this.equipment = equipment || DEFAULTS.equipment[this.profession]();
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

        this.stats.hp.max = profession.hp(this);
        this.stats.mp.max = profession.mp(this);
    }

    fullheal() {
        const profession = require(`../../character/professions/${this.profession}`).default;
        this.stats.hp.cur = profession.hp(this);
        this.stats.mp.cur = profession.mp(this);
    }
}