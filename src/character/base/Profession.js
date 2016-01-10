
export default class Profession {
    static getLevel(player) { return player.professionLevels[player.profession]; }
    static hp(player) { return this.getLevel(player) * 10; }
    static mp() { return 0; }
    static str() { return 1; }
    static int() { return 1; }
    static agi() { return 1; }
    static luk() { return 1; }
}