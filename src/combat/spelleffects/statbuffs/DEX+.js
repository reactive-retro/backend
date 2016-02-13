
import SpellEffect from '../../base/SpellEffect';

export default class DEXPlus extends SpellEffect {
    apply(target) {
        super.apply(target);
        target.addBuff('dex', this.statBuff * this.multiplier);
    }

    unapply(target) {
        super.unapply(target);
        target.subBuff('dex', this.statBuff * this.multiplier);
    }
}