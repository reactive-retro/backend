
import SpellEffect from '../../base/SpellEffect';

export default class LUKPlus extends SpellEffect {
    apply(target) {
        super.apply(target);
        super.apply(target);
        const appliedValue = this.statBuff * this.multiplier;
        target.addBuff('luk', appliedValue);
        return `${target.name} is ${this.numberToUtility(appliedValue)} more lucky.`;
    }

    unapply(target) {
        super.unapply(target);
        target.subBuff('luk', this.statBuff * this.multiplier);
    }
}