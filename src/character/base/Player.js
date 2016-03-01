
import _ from 'lodash';

import Character from './Character';
import DEFAULTS from '../../static/chardefaults';
import SkillManager from '../../objects/skillmanager';
import save, { selectiveSave } from '../functions/save';
import { monstertoken as generateMonsterToken } from '../../functions/world/nearbymonsters';

export default class Player extends Character {
    constructor({ name, profession, options, monsterToken, skills, inventory, equipment, stats, unlockedProfessions, professionLevels, userId, homepoint, statusEffects, cooldowns, battleId }) {

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

        this.options = options || {};
        this.monsterToken = monsterToken;
        this.userId = userId;
        this.battleId = battleId;
        this.homepoint = homepoint;

        this.handleDefaults();
        this.checkForNewMonsters();
    }

    checkForNewMonsters() {
        const checkToken = generateMonsterToken(this);

        if(this.monsterToken !== checkToken) {
            this.needsMonsterRefresh = true;
        }
        this.monsterToken = checkToken;
        selectiveSave(this, ['monsterToken']);
    }

    handleDefaults() {

        const defaultWeapon = _.findWhere(this.inventory, { type: 'weapon', isDefault: true });
        if(!this.equipment.weapon.isDefault && !defaultWeapon) {
            this.inventory.push(DEFAULTS.defaultEquipment.weapon());
        }

        const defaultArmor = _.findWhere(this.inventory, { type: 'armor', isDefault: true });
        if(!this.equipment.armor.isDefault && !defaultArmor) {
            this.inventory.push(DEFAULTS.defaultEquipment.armor());
        }

        const nonExistentSkills = _.compact(SkillManager.getSkillsThatDontExist(this));
        if(nonExistentSkills.length > 0) {
            this.skills = _.without(this.skills, ...nonExistentSkills);
        }
    }

    addGold(gold) {
        if(!this.stats.gold || this.stats.gold < 0 || _.isNaN(this.stats.gold)) this.stats.gold = 0;
        this.stats.gold += gold;
    }

    clearDataOnLogin() {
        this.needsMonsterRefresh = true;
        this.battleId = null;
        this.cooldowns = {};
        this.statusEffects = [];
        this.equipment.buffs.stats = {};
        this.fullheal();
        this.save();
    }

    save() {
        return save(this);
    }
}