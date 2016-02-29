
import SpellEffect from '../../base/SpellEffect';

export default class Stun extends SpellEffect {
    blocksTurn(target) { return `${target.name} is stunned!`; }
    apply(target, caster) {
        super.apply(target, caster);

        return `${target.name} was stunned by ${caster.name}!`;
    }
}