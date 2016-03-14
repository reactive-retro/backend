
import SpellEffect from '../../base/SpellEffect';

export default class Flee extends SpellEffect {
    apply(target) {
        target.isFled = true;
        return `${target.name} fled from combat!`;
    }
}