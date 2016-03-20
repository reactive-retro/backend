
import SpellEffect from '../../base/SpellEffect';

export default class Heal extends SpellEffect {
    apply(target) {
        if(target.stats.hp.atMin()) return `${target.name} is currently dead and can't be healed!`;
        target.stats.hp.add(this.statBuff);
        return `${target.name} was healed for ${this.statBuff} HP!`;
    }
}