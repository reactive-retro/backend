
import { itemId } from '../functions/player/helpers';

export default {
    unlockedProfessions: ['Thief', 'Fighter', 'Mage'],
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
        },
        str: 0,
        vit: 0,
        dex: 0,
        mnt: 0,
        luk: 0
    },
    defaultEquipment: {
        armor: () => {
            return {
                type: 'armor',
                name: 'Town Clothes',
                isDefault: true,
                itemId: itemId(),
                stats: {}
            };
        },
        weapon: () => {
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
        Fighter: () => ({
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
                    dex: 1
                }
            }
        }),
        Mage: () => ({
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
                    dex: 1
                }
            }
        }),
        Thief: () => ({
            weapon: {
                type: 'weapon',
                name: 'Dagger',
                itemId: itemId(),
                stats: {
                    dex: 2
                }
            },
            armor: {
                type: 'armor',
                name: 'Leather Armor',
                itemId: itemId(),
                stats: {
                    vit: 1
                }
            }
        }),
        Cleric: () => ({
            weapon: {
                type: 'weapon',
                name: 'Mace',
                itemId: itemId(),
                stats: {
                    mnt: 1,
                    str: 1
                }
            },
            armor: {
                type: 'armor',
                name: 'Cleric Armor',
                itemId: itemId(),
                stats: {
                    dex: 1
                }
            }
        })
    }
};