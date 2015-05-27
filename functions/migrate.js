module.exports = function(player) {

    if(!player.unlockedProfessions) {
        player.unlockedProfessions = ['Cleric', 'Mage', 'Fighter'];
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