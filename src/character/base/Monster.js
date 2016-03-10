
import { monsterId } from '../../functions/helpers';

import Character from './Character';

export default class Monster extends Character {
    constructor({ seed, verifyToken, name, equipment, bonusXp, skills, goldDrop, profession, location, rating, professionLevels, stats, statusEffects, cooldowns, id }) {

        super({
            name,
            statusEffects,
            equipment,
            cooldowns,
            skills,
            stats,
            profession: profession || 'Monster',
            professionLevels: professionLevels || { Monster: 1 }
        });

        this.id = id || monsterId(seed);
        this.bonusXp = bonusXp || 0;
        this.seed = seed;
        this.verifyToken = verifyToken;
        this.location = location;
        this.rating = rating;
        this.goldDrop = goldDrop;
        this.calculate();
    }
}