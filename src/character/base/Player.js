
import _ from 'lodash';

import Character from './Character';
import DEFAULTS from '../../static/chardefaults';
import SkillManager from '../../objects/skillmanager';
import dbPromise from '../../objects/db';
import save from '../functions/save';

export default class Player extends Character {
    constructor({ name, profession, skills, inventory, equipment, stats, unlockedProfessions, professionLevels, userId, homepoint, statusEffects, cooldowns, battleId }) {

        super({
            name,
            profession,
            professionLevels,
            unlockedProfessions,
            statusEffects,
            stats,
            skills,
            inventory,
            cooldowns,
            equipment
        });

        this.userId = userId;
        this.battleId = battleId;
        this.homepoint = homepoint;

        this.handleDefaults();
    }

    handleDefaults() {

        var defaultWeapon = _.findWhere(this.inventory, {type: 'weapon', isDefault: true});
        if(!this.equipment.weapon.isDefault && !defaultWeapon) {
            this.inventory.push(DEFAULTS.defaultEquipment.weapon());
        }

        var defaultArmor = _.findWhere(this.inventory, {type: 'armor', isDefault: true});
        if(!this.equipment.armor.isDefault && !defaultArmor) {
            this.inventory.push(DEFAULTS.defaultEquipment.armor());
        }

        const nonExistentSkills = _.compact(SkillManager.getSkillsThatDontExist(this));
        if(nonExistentSkills.length > 0) {
            this.skills = _.without(this.skills, ...nonExistentSkills);
        }
    }

    save() {
        save(this);
    }
}