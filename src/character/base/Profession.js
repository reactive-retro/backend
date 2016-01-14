
export default class Profession {
    static getLevel(player) { return player.professionLevels[player.profession]; }
    static hp(player) { return this.getLevel(player) * 10; }
    static mp() { return 0; }
    static str() { return 1; }
    static mnt() { return 1; }
    static dex() { return 1; }
    static vit() { return 1; }
    static luk() { return 1; }
}