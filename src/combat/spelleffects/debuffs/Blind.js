
import SpellEffect from '../../base/SpellEffect';

export default class Blind extends SpellEffect {
    apply(target) {
        super.apply(target);
        target.addBuff('acc', -75);
    }

    unapply(target) {
        super.unapply(target);
        target.subBuff('acc', 75);
    }
}