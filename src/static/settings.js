
import ProfessionManager from '../objects/professionmanager';

export default {
    RADIUS: 5000,
    INVENTORY_SIZE: 50,
    HOMEPOINT_CHANGE_HOURS: 4,
    MAX_PARTY_MEMBERS: 5,
    MAX_PARTY_JOIN_DISTANCE: 200,
    MAX_LEVEL: 50,

    CLASS_DESCRIPTIONS: ProfessionManager.getProfessionDescriptions(),

    MONSTER_GENERATION: {
        PLAYER: {
            offsets: {
                lat:    0.050,
                lon:    0.045,
                radius: 0.043
            },
            amounts: {
                min: 500,
                max: 650
            }
        },
        DUNGEON: {
            levelOffset: {
                min: 2,
                max: 5
            },
            offsets: {
                lat:    0.001,
                lon:    0.001,
                radius: 0.001
            },
            amounts: {
                min: 9,
                max: 15
            }
        }
    }
};