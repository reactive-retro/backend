'use strict';

var _ = require('lodash');

var save = require('./save');

var itemId = require('./helpers').itemId;
var DEFAULTS = require('../static/chardefaults');

module.exports = function(player) {

    if(!player.unlockedProfessions) {
        player.unlockedProfessions = DEFAULTS.unlockedProfessions;
    }

    if(!player.professionLevels) {
        player.professionLevels = {};
        _.each(player.unlockedProfessions, function(prof) { player.professionLevels[prof] = 1; });
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

    save(player);

    return player;
};