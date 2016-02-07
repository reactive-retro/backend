
import uuid from 'node-uuid';

import Character from './Character';

export default class Monster extends Character {
    constructor({ seed, verifyToken, name, profession, location, rating, professionLevels }) {

        super({
            name,
            profession: profession || 'Monster',
            professionLevels: professionLevels || { Monster: 1 }
        });

        this.id = uuid.v4();
        this.seed = seed;
        this.verifyToken = verifyToken;
        this.location = location;
        this.rating = rating;
        this.fullheal();
    }
}