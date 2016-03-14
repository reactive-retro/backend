
import _ from 'lodash';
import RestrictedNumber from 'restricted-number';

import Character from './Character';
import DEFAULTS from '../../static/chardefaults';
import SETTINGS from '../../static/settings';
import SkillManager from '../../objects/skillmanager';
import ProfessionManager from '../../objects/professionmanager';
import XPCalculator from '../../objects/xpcalculator';
import save, { selectiveSave } from '../functions/save';
import { monstertoken as generateMonsterToken } from '../../functions/world/nearbymonsters';
import { shoptoken as generateShopToken } from '../../functions/world/nearbyplaces';

export default class Player extends Character {
    constructor({ name, profession, options,
                  monsterToken, shopToken, skills, inventory,
                  equipment, stats, unlockedProfessions,
                  professionLevels, userId, homepoint,
                  statusEffects, cooldowns, battleId,
                  lastHomepointChange, professionXp, location,
                  partyId, actionsTaken }) {

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
        this.actionsTaken = actionsTaken || {};
        this.monsterToken = monsterToken;
        this.shopToken = shopToken;
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
        this.checkShopsForNewInventory();
        this.checkIfCanChangeHomepoint();
        this.updateUnlockedProfessions();
    }

    updateUnlockedProfessions() {
        const current = this.unlockedProfessions;
        const all = ProfessionManager.getUnlockedProfessions(this);

        this.unlockedProfessions = all;
        return _.difference(all, current);
    }

    hasTakenAction(action, mainType, subType) {
        if(!this.actionsTaken) return false;
        if(!this.actionsTaken[action]) return false;

        if(subType) {
            if(!this.actionsTaken[action][mainType]) return false;
            return _.contains(this.actionsTaken[action][mainType], subType);
        }

        return _.contains(this.actionsTaken[action], mainType);
    }

    markActionTaken(action, mainType, subType) {
        if(!this.actionsTaken) this.actionsTaken = {};

        if(subType) {

            // shops, chests, etc
            if(!this.actionsTaken[action]) this.actionsTaken[action] = {};
            if(!this.actionsTaken[action][mainType]) this.actionsTaken[action][mainType] = [];
            this.actionsTaken[action][mainType].push(subType);

        } else {

            // monsters killed
            if(!this.actionsTaken[action]) this.actionsTaken[action] = [];
            this.actionsTaken[action].push(mainType);
        }
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

    takeAStep() {
        // no regen while in combat
        if(this.battleId) return;

        this.stats.hp.addPercent(5);
        this.stats.hp.add(1);
        this.stats.hp.__current = Math.floor(this.stats.hp.__current);

        this.stats.mp.addPercent(5);
        this.stats.mp.add(1);
        this.stats.mp.__current = Math.floor(this.stats.mp.__current);
    }

    checkForNewMonsters() {
        // specify it out to a certain gps precision so small changes don't affect everything
        const seedHomepoint = _.cloneDeep(this.homepoint);
        seedHomepoint.lat = seedHomepoint.lat.toFixed(5);
        seedHomepoint.lon = seedHomepoint.lon.toFixed(5);

        const checkToken = generateMonsterToken(JSON.stringify(seedHomepoint)+this.profession);

        if(this.monsterToken !== checkToken) {
            this.needsMonsterRefresh = true;
            this.actionsTaken.monsters = [];
        }
        this.monsterToken = checkToken;
        selectiveSave(this, ['monsterToken', 'actionsTaken']);
    }

    checkShopsForNewInventory() {
        const checkToken = generateShopToken();

        if(this.shopToken !== checkToken) {
            this.sendPlaces = true;
            this.actionsTaken.shop = {};
            this.actionsTaken.dungeonMonster = [];
        }
        this.shopToken = checkToken;
        selectiveSave(this, ['shopToken', 'actionsTaken']);
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