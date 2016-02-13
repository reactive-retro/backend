
import SpellEffect from '../../base/SpellEffect';

export default class Freeze extends SpellEffect {
    blocksTurn(target) { return `${target.name} is frozen solid!`; }
    apply(target, caster) {
        super.apply(target, caster);

        return `${target.name} was turned into a block of ice by ${caster.name}!`
    }
}