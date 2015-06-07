'use strict';

var itemId = require('../functions/helpers').itemId;

module.exports = {
    unlockedProfessions: ['Cleric', 'Fighter', 'Mage'],
    stats: {
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
    },
    defaultEquipment: {
        armor: function() {
            return {
                type: 'armor',
                name: 'Town Clothes',
                isDefault: true,
                itemId: itemId(),
                stats: {}
            };
        },
        weapon: function() {
            return {
                type: 'weapon',
                name: 'Fist',
                isDefault: true,
                itemId: itemId(),
                stats: {}
            };
        }
    },
    equipment: {
        Fighter: function() {
            return {
                weapon: {
                    type: 'weapon',
                    name: 'Knife',
                    itemId: itemId(),
                    stats: {
                        str: 2
                    }
                },
                armor: {
                    type: 'armor',
                    name: 'Fighter Armor',
                    itemId: itemId(),
                    stats: {
                        agi: 1
                    }
                }
            };
        },
        Mage: function() {
            return {
                weapon: {
                    type: 'weapon',
                    name: 'Wand',
                    itemId: itemId(),
                    stats: {
                        int: 2
                    }
                },
                armor: {
                    type: 'armor',
                    name: 'Robe',
                    itemId: itemId(),
                    stats: {
                        agi: 1
                    }
                }
            };
        },
        Cleric: function() {
            return {
                weapon: {
                    type: 'weapon',
                    name: 'Mace',
                    itemId: itemId(),
                    stats: {
                        int: 1,
                        str: 1
                    }
                },
                armor: {
                    type: 'armor',
                    name: 'Cleric Armor',
                    itemId: itemId(),
                    stats: {
                        agi: 1
                    }
                }
            };
        }
    }
};