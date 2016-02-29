
import SpellEffect from '../../base/SpellEffect';

export default class Refresh extends SpellEffect {
    apply(target) {
        target.stats.mp.add(this.statBuff);
        return `${target.name} refreshed ${this.statBuff} MP!`;
    }
}