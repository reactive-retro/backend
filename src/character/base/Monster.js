
import uuid from 'node-uuid';

import Character from './Character';

export default class Monster extends Character {
    constructor({ seed, verifyToken, name, profession, location, rating, professionLevels, stats, statusEffects, cooldowns, id }) {

        super({
            name,
            statusEffects,
            cooldowns,
            stats,
            profession: profession || 'Monster',
            professionLevels: professionLevels || { Monster: 1 }
        });

        this.id = id || uuid.v4();
        this.seed = seed;
        this.verifyToken = verifyToken;
        this.location = location;
        this.rating = rating;
    }
}