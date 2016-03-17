
import _ from 'lodash';

import SpellEffect from '../../base/SpellEffect';

export default class Steal extends SpellEffect {
    apply(target, caster) {

        if(!target.inventory.length) {
            return `${target.name} doesn't have any items!`;
        }

        const messages = [];
        for(let i = 0; i < this.multiplier; i++) {
            const stolenItem = _.sample(target.inventory);
            if(!stolenItem) {
                messages.push(`${target.name} isn't carrying any more items!`);
                return;
            }

            target.removeFromInventory(stolenItem);
            caster.addToInventory(stolenItem);
            messages.push(`${caster.name} stole ${stolenItem.name} from ${target.name}!`);
        }

        return messages;
    }
}