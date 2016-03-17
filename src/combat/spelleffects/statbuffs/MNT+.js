
import SpellEffect from '../../base/SpellEffect';

export default class MNTPlus extends SpellEffect {
    apply(target) {
        super.apply(target);
        const appliedValue = this.statBuff * this.multiplier;
        target.addBuff('mnt', appliedValue);
        return `${target.name} is ${this.numberToUtility(appliedValue)} more mentally powerful.`;
    }

    unapply(target) {
        super.unapply(target);
        target.subBuff('mnt', this.statBuff * this.multiplier);
    }
}