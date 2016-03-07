
import _ from 'lodash';
import RestrictedNumber from 'restricted-number';

import Character from './Character';
import DEFAULTS from '../../static/chardefaults';
import SETTINGS from '../../static/settings';
import SkillManager from '../../objects/skillmanager';
import XPCalculator from '../../objects/xpcalculator';
import save, { selectiveSave } from '../functions/save';
import { monstertoken as generateMonsterToken } from '../../functions/world/nearbymonsters';

export default class Player extends Character {
    constructor({ name, profession, options,
                  monsterToken, skills, inventory,
                  equipment, stats, unlockedProfessions,
                  professionLevels, userId, homepoint,
                  statusEffects, cooldowns, battleId,
                  lastHomepointChange, professionXp, location,
                  partyId }) {

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
        this.professionXp = professionXp || {};
        this.monsterToken = monsterToken;
        this.userId = userId;
        this.battleId = battleId;
        this.partyId = partyId;
        this.homepoint = homepoint;
        this.sellModifier = 4;
        this.lastHomepointChange = lastHomepointChange;
        this.location = location;
        this.calculate();

        this.stats.xp = new RestrictedNumber(0, this.stats.xp.maximum || XPCalculator.calculate(2), this.stats.xp.__current || 0);

        this.handleDefaults();
        this.checkForNewMonsters();
        this.checkIfCanChangeHomepoint();
    }

    changeHomepoint(newHomepoint) {
        this.lastHomepointChange = Date.now();
        this.homepoint = newHomepoint;
        this.sendPlaces = true;
        this.checkForNewMonsters();
        selectiveSave(this, ['lastHomepointChange', 'homepoint']);
    }

    checkIfCanChangeHomepoint() {
        if(!this.lastHomepointChange) {
            this.canChangeHomepoint = true;
            return;
        }

        const now = Date.now();
        const prevChange = new Date(this.lastHomepointChange);
        prevChange.setHours(prevChange.getHours() + SETTINGS.HOMEPOINT_CHANGE_HOURS);
        const prevTest = prevChange.getTime();
        this.canChangeHomepoint = prevTest <= now;
    }

    checkForNewMonsters() {
        // specify it out to a certain gps precision so small changes don't affect everything
        const seedHomepoint = _.cloneDeep(this.homepoint);
        seedHomepoint.lat = seedHomepoint.lat.toFixed(5);
        seedHomepoint.lon = seedHomepoint.lon.toFixed(5);

        const checkToken = generateMonsterToken(JSON.stringify(seedHomepoint)+this.profession);

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

    addXP(xp) {
        this.stats.xp.add(xp);
        if(this.stats.xp.atMax()) {
            return this.levelUp();
        }
    }

    levelUp() {
        if(this.currentLevel === SETTINGS.MAX_LEVEL) return;
        this.professionLevels[this.profession]++;
        this.stats.xp.maximum = XPCalculator.calculate();
        this.stats.xp = new RestrictedNumber(0, XPCalculator.calculate(this.currentLevel), 0);
        return true;
    }

    setLocation(location) {
        this.location = location;
        selectiveSave(this, ['location']);
    }

    changeClass(newProfession) {
        if(!this.professionLevels[newProfession]) {
            this.professionLevels[newProfession] = 1;
        }

        if(!this.professionXp[this.profession]) {
            this.professionXp[this.profession] = this.stats.xp.getValue();
        }

        this.profession = newProfession;

        if(!this.professionXp[this.profession]) {
            this.professionXp[this.profession] = 0;
        }

        this.stats.xp = new RestrictedNumber(0, XPCalculator.calculate(this.currentLevel), this.professionXp[this.profession]);

        this.calculate();
        this.skills = [];
        this.fullheal();
    }

    clearDataOnLogin() {
        this.needsMonsterRefresh = true;
        this.partyId = null;
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

    selectiveSave(keys) {
        return selectiveSave(this, keys);
    }
}