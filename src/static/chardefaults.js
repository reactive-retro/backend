
import Armor from '../items/Armor';
import Weapon from '../items/Weapon';

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
        luk: 0,
        acc: 0
    },
    skills: [null, null, null, null, null, null],
    defaultEquipment: {
        armor: () => new Armor({ name: 'Town Clothes', isDefault: true }),
        weapon: () => new Weapon({ name: 'Fist', isDefault: true })
    },
    equipment: {
        Fighter: () => ({
            weapon: new Weapon({ name: 'Frying Pan', stats: { str: 2 } }),
            armor: new Armor({ name: 'Fighter Armor', stats: { dex: 1, vit: 1 } })
        }),
        Mage: () => ({
            weapon: new Weapon({ name: 'Twig', stats: { mnt: 2 } }),
            armor: new Armor({ name: 'Mage Robe', stats: { mnt: 1, vit: 1 } })
        }),
        Thief: () => ({
            weapon: new Weapon({ name: 'Kitchen Knife', stats: { dex: 2 } }),
            armor: new Armor({ name: 'Thief Jerkin', stats: { vit: 1, dex: 1 } })
        }),
        Monster: () => ({
            weapon: new Weapon({ name: 'Claw' }),
            armor: new Armor({ name: 'Pelt' })
        })
    }
};