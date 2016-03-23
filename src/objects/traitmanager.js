
import _ from 'lodash';

const traitsHash = require('require-dir')('../character/traits', { recurse: true });
const traits = _(traitsHash)
    .values()
    .map(traits => {
        return _(traits)
            .values()
            .pluck('default')
            .map(x => x.prototype)
            .value();
    })
    .flatten()
    .value();

const traitNames = _.pluck(traits, 'traitName');

export const allTraits = traits;

export default class TraitManager {

    static getTrait(trait) {
        return _.find(traits, { traitName: trait });
    }

    static isTraitDisabled(trait) {
        return _.find(traits, { traitName: trait, traitDisabled: true });
    }

    static doesTraitExist(trait) {
        return _.contains(traitNames, trait);
    }

    static getTraitsThatDontExist(player) {
        const disabledTraits = _.filter(player.traits, this.isTraitDisabled);
        return _.difference(player.traits, traitNames).concat(disabledTraits);
    }

    static getValidTraits(player) {
        const validTraits = this.getTraits(player);
        const allValidTraits = _.map(validTraits, 'traitName');
        return _.map(player.traits, traitName => _.contains(allValidTraits, traitName) ? traitName : null);
    }

    static getTraitsAtLevel(player) {
        return _.filter(traits, trait => {
            return trait.traitClasses[player.profession] === player.currentLevel;
        });
    }

    static getTraits(player) {
        return _(traits)
            .filter(trait => {
                return _(trait.traitClasses)
                    .keys()
                    .any(profession => {

                        // you need to be level x*2 to use a trait outside of a profession.
                        // some trait will not translate, as a result
                        let multiplier = 2;
                        if(player.profession === profession) {
                            multiplier = 1;
                        }
                        return player.professionLevels[profession] >= trait.traitClasses[profession]*multiplier;
                    });
            })
            .value();
    }
}