
import SpellEffect from '../../base/SpellEffect';

export default class Burn extends SpellEffect {
    apply(target, caster) {
        super.apply(target, caster);
        this.damagePerTurn = caster.stats.mnt;
        return `${target.name} was burned!`;
    }

    preTurn(target) {
        target.stats.hp.sub(this.damagePerTurn);
        const isDead = target.stats.hp.atMin() ? `${target.name} was slain!` : '';
        return `${target.name} took ${this.damagePerTurn} damage due to mild burns! ${isDead}`;
    }
}