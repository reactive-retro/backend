
import SpellEffect from '../../base/SpellEffect';

export default class DEXPlus extends SpellEffect {
    apply(target) {
        super.apply(target);
        super.apply(target);
        const appliedValue = this.statBuff * this.multiplier;
        target.addBuff('dex', appliedValue);
        return `${target.name} is ${this.numberToUtility(appliedValue)} more dextrous.`;
    }

    unapply(target) {
        super.unapply(target);
        target.subBuff('dex', this.statBuff * this.multiplier);
    }
}