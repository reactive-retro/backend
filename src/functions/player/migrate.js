
import _ from 'lodash';

import save from './save';
import { itemId } from './helpers';
import DEFAULTS from '../../static/chardefaults';
import SkillManager from '../../objects/skillmanager';

export default (player) => {

    if(!player.unlockedProfessions) {
        player.unlockedProfessions = DEFAULTS.unlockedProfessions;
    }

    if(!player.professionLevels) {
        player.professionLevels = {};
        _.each(player.unlockedProfessions, (prof) => { player.professionLevels[prof] = 1; });
    }

    if(!player.inventory) {
        player.inventory = [];
    }

    if(!player.equipment) {
        player.equipment = DEFAULTS.equipment[player.profession]();
    }

    var defaultWeapon = _.findWhere(player.inventory, {type: 'weapon', isDefault: true});
    if(!player.equipment.weapon.isDefault && !defaultWeapon) {
        player.inventory.push(DEFAULTS.defaultEquipment.weapon());
    }

    var defaultArmor = _.findWhere(player.inventory, {type: 'armor', isDefault: true});
    if(!player.equipment.armor.isDefault && !defaultArmor) {
        player.inventory.push(DEFAULTS.defaultEquipment.armor());
    }

    if(!player.stats) {
        player.stats = DEFAULTS.stats;
    }

    if(!player.skills) {
        player.skills = [null, null, null, null, null, null];
    }

    const nonExistentSkills = SkillManager.getSkillsThatDontExist(player);
    if(nonExistentSkills.length > 0) {
        player.skills = _.without(player.skills, ...nonExistentSkills);
    }

    save(player);

    return player;
};