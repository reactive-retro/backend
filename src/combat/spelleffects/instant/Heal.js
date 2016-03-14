
import SpellEffect from '../../base/SpellEffect';

export default class Heal extends SpellEffect {
    apply(target) {
        target.stats.hp.add(this.statBuff);
        return `${target.name} was healed for ${this.statBuff} HP!`;
    }
}