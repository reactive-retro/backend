
import SpellEffect from '../../base/SpellEffect';

export default class STRPlus extends SpellEffect {
    apply(target) {
        super.apply(target);
        const appliedValue = this.statBuff * this.multiplier;
        target.addBuff('str', appliedValue);
        return `${target.name} is ${this.numberToUtility(appliedValue)} more physically powerful.`;
    }

    unapply(target) {
        super.unapply(target);
        target.subBuff('str', this.statBuff * this.multiplier);
    }
}