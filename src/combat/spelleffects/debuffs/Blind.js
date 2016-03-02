
import SpellEffect from '../../base/SpellEffect';

export default class Blind extends SpellEffect {
    apply(target) {
        super.apply(target);
        target.subBuff('acc', 75);
        return `${target.name} was blinded!`;
    }

    unapply(target) {
        super.unapply(target);
        target.addBuff('acc', 75);
    }
}