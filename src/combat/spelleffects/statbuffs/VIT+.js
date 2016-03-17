
import SpellEffect from '../../base/SpellEffect';

export default class VITPlus extends SpellEffect {
    apply(target) {
        super.apply(target);
        const appliedValue = this.statBuff * this.multiplier;
        target.addBuff('vit', appliedValue);
        return `${target.name} is ${this.numberToUtility(appliedValue)} more fortuitous.`;
    }

    unapply(target) {
        super.unapply(target);
        target.subBuff('vit', this.statBuff * this.multiplier);
    }
}