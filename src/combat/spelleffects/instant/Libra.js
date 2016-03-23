
import _ from 'lodash';

import SpellEffect from '../../base/SpellEffect';

export default class Libra extends SpellEffect {
    apply(target) {
        const messages = [];

        messages.push(`${target.name} has ${target.stats.hp.__current}/${target.stats.hp.maximum} HP.`);
        if(!target.equipment.weapon) messages.push(`${target.name} has no weapon.`);
        else                         messages.push(`${target.name} has, in hand, ${target.equipment.weapon.name}.`);

        if(!target.equipment.armor)  messages.push(`${target.name} has no armor.`);
        else                         messages.push(`${target.name} has, on body, ${target.equipment.armor.name}.`);

        if(!target.inventory.length) messages.push(`${target.name} has no items in inventory.`);
        else                         messages.push(`${target.name} has ${target.inventory.length} items in inventory.`);

        return messages;
    }
}