
import SpellEffect from '../../base/SpellEffect';

export default class Shock extends SpellEffect {
    blocksTurn(target) { return Math.random() > 0.25 ? '' : `${target.name} is recovering from shock!`; }
    apply(target, caster) {
        super.apply(target, caster);

        return `${target.name} got a shock sent through them by ${caster.name}!`;
    }
}