
import SpellEffect from '../../base/SpellEffect';

export default class ACCPlus extends SpellEffect {
    apply(target) {
        super.apply(target);
        const appliedValue = this.statBuff * this.multiplier;
        target.addBuff('acc', appliedValue);
        return `${target.name} is ${this.numberToUtility(appliedValue)} more accurate.`;
    }

    unapply(target) {
        super.unapply(target);
        target.subBuff('acc', this.statBuff * this.multiplier);
    }
}