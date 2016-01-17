
export default class Monster {
    constructor(options) {
        this.seed = options.seed;
        this.verifyToken = options.verifyToken;
        this.name = options.name;
        this.profession = options.profession;
        this.location = options.location;
        this.rating = options.rating;
        this.professionLevels = { Monster: 1 };
    }
}