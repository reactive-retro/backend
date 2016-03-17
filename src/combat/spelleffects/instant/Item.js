
import _ from 'lodash';
import Dice from 'dice.js';

import SpellEffect from '../../base/SpellEffect';

export default class Item extends SpellEffect {
    apply(target, caster, extraData) {
        const itemName = extraData.actionData.itemName;
        caster.itemUses[itemName] -= 1;

        const itemRef = _.find(caster.inventory, { name: itemName });
        caster.useItem(itemRef);
        const messages = [];

        const transformedEffects = _.reduce(itemRef.effects, (prev, effectData) => {
            const data = {
                chance: effectData.chance || 100,
                instant: effectData.instant || true,
                statBuff: effectData.statBuff,
                duration: +Dice.roll(''+(effectData.duration || 1))
            };
            prev[effectData.name] = data;
            return prev;
        }, {});

        messages.push(...extraData.selfCallback({ spellName: itemName, spellEffects: transformedEffects }, target));

        return messages;
    }
}