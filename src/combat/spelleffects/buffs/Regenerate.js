
import SpellEffect from '../../base/SpellEffect';

export default class Regenerate extends SpellEffect {
    apply(target, caster) {
        super.apply(target, caster);
        this.healPerTurn = Math.floor(caster.stats.mnt / 5);
        this.casterName = caster.name;
        return `${target.name} is regenerating health!`;
    }

    preTurn(target) {
        target.stats.hp.add(this.healPerTurn);
        return `${target.name} healed ${this.healPerTurn} damage from ${this.casterName}'s regenerative aura!`;
    }
}