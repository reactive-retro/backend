
import _ from 'lodash';
import Dice from 'dice.js';

import SpellEffect from '../../base/SpellEffect';

export default class Steal extends SpellEffect {
    apply(target, caster) {
        const messages = [];

        if(!target.inventory.length) {
            messages.push(`${target.name} doesn't have any items!`);
        }

        for(let i = 0; i < Math.min(this.multiplier, target.inventory.length); i++) {
            const stolenItem = _.sample(target.inventory);
            if(!stolenItem) {
                messages.push(`${target.name} isn't carrying any more items!`);
                return;
            }

            // you should get this back after battle if a monster steals it from you
            stolenItem.dropRate = 100;

            target.removeFromInventory(stolenItem);
            caster.addToInventory(stolenItem);
            messages.push(`${caster.name} stole ${stolenItem.name} from ${target.name}!`);
        }

        const buffs = ['Regenerate', 'Stealth', 'STRPlus', 'DEXPlus', 'LUKPlus', 'VITPlus', 'ACCPlus', 'MNTPlus'];
        if(caster.hasTraitEffect('Steal+Buff')) {
            const buffStolen = _(target.statusEffects).filter(effect => _.contains(buffs, effect.effectName)).sample();
            if(buffStolen) {
                _.pull(target.statusEffects, buffStolen);
                caster.statusEffects.push(buffStolen);
                messages.push(`${caster.name} stole ${buffStolen.effectName} from ${target.name}!`);
            }
        }

        if(caster.hasTraitEffect('Steal+Health')) {
            const healthStolen = Math.max(1, Math.floor(target.stats.hp.getValue() * 0.05));
            caster.stats.hp.add(healthStolen);
            target.stats.hp.sub(healthStolen);
            messages.push(`${caster.name} stole ${healthStolen} HP!`);
        }

        if(caster.hasTraitEffect('Steal+Gold')) {
            const goldGained = +Dice.roll(target.goldDrop);
            caster.addGold(goldGained);
            messages.push(`${caster.name} stole ${goldGained} gold from ${target.name}!`);
        }

        return messages;
    }
}