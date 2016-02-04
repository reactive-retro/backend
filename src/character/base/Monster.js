
export default class Monster {
    constructor({ seed, verifyToken, name, profession, location, rating, professionLevels }) {
        this.seed = seed;
        this.verifyToken = verifyToken;
        this.name = name;
        this.profession = profession;
        this.location = location;
        this.rating = rating;
        this.professionLevels = professionLevels || { Monster: 1 };
    }
}