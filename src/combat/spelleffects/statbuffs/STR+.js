
import SpellEffect from '../../base/SpellEffect';

export default class STRPlus extends SpellEffect {
    apply(target) {
        super.apply(target);
        target.addBuff('str', this.statBuff * this.multiplier);
    }

    unapply(target) {
        super.unapply(target);
        target.subBuff('str', this.statBuff * this.multiplier);
    }
}