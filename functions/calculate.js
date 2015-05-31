module.exports = function(player) {

    console.log('test');

    class x {
        static test() { console.log('pie'); }
    }
    console.log('decl');
    x.test();
    console.log(require(`../player/professions/${player.profession}`));
    var profession = require(`../player/professions/${player.profession}`);
    console.log(profession.hp(player));
    return player;
};