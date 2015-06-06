'use strict';

var _ = require('lodash');

var save = require('./save');

module.exports = function(player) {

    if(!player.unlockedProfessions) {
        player.unlockedProfessions = ['Cleric', 'Fighter', 'Mage'];
    }

    if(!player.professionLevels) {
        player.professionLevels = {};
        _.each(player.unlockedProfessions, function(prof) { player.professionLevels[prof] = 1; });
    }

    if(!player.inventory) {
        player.inventory = [];
    }

    if(!player.equipment) {
        player.equipment = {
            weapon: {
                type: 'weapon',
                name: 'Knife',
                stats: {
                    str: 1
                }
            },
            armor: {
                type: 'armor',
                name: 'Shirt',
                stats: {
                    agi: 1
                }
            }
        }
    }

    if(!player.stats) {
        player.stats = {
            gold: 0,
            xp: {
                cur: 0,
                max: 100
            },
            hp: {
                cur: 10,
                max: 10
            },
            mp: {
                cur: 0,
                max: 0
            }
        }
    }

    //this can be repetitively set safely
    player.defaultEquipment = {
        weapon: {
            type: 'weapon',
            name: 'Fist'
        },
        armor: {
            type: 'armor',
            name: 'None'
        }
    };

    save(player);

    return player;
};