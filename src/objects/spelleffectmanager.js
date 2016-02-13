
import _ from 'lodash';

const spellEffectHierarchy = require('require-dir')('../combat/spelleffects', { recurse: true });

const allSpellEffectsHash = _(spellEffectHierarchy)
    .values()
    .reduce((prev, cur) => {
        _.extend(prev, cur);
        return prev;
    }, {});

export default class SpellEffectManager {
    static getEffectByName(name) {
        if(!allSpellEffectsHash[name]) {
            console.error(`ERROR: ${name} is not a valid spell effect.`);
        }
        return allSpellEffectsHash[name].default;
    }
}