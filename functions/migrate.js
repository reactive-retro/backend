var _ = require('lodash');

module.exports = (player) => {

    if(!player.unlockedProfessions) {
        player.unlockedProfessions = ['Cleric', 'Mage', 'Fighter'];
    }

    if(!player.professionLevels) {
        player.professionLevels = {};
        _.each(player.unlockedProfessions, (prof) => player.professionLevels[prof] = 1);
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

    return player;
};