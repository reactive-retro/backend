
import { itemId } from '../functions/helpers';

export default {
    unlockedProfessions: ['Thief', 'Fighter', 'Mage'],
    stats: {
        gold: 0,
        xp: {},
        hp: {},
        mp: {},
        str: 0,
        vit: 0,
        dex: 0,
        mnt: 0,
        luk: 0
    },
    skills: [null, null, null, null, null, null],
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
                name: 'Frying Pan',
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
                name: 'Twig',
                itemId: itemId(),
                stats: {
                    mnt: 2
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
                name: 'Kitchen Knife',
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
        Monster: () => ({
            weapon: {
                type: 'weapon',
                name: 'Claw',
                stats: {
                    str: 1
                }
            },
            armor: {
                type: 'armor',
                name: 'Pelt',
                itemId: itemId(),
                stats: {
                    dex: 1
                }
            }
        })
    }
};