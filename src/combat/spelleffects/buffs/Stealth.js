
import SpellEffect from '../../base/SpellEffect';

export default class Stealth extends SpellEffect {
    static apply(player) {
        return `${player.name} stepped into the shadows.`;
    }
}