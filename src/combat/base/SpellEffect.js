
import _ from 'lodash';

export default class SpellEffect {

    constructor({ duration = 0, multiplier = 1, statBuff = 0, casterName, skillName }) {
        this.effectName = this.constructor.name.split('Plus').join('+').split('Minus').join('-');
        this.baseDuration = duration;
        this.multiplier = multiplier;
        this.statBuff = statBuff;
        this.casterName = casterName;
        this.skillName = skillName;
    }

    decrementTurns(target) {
        this.turnsLeft--;
        if(this.turnsLeft <= 0) {
            this.unapply(target);
        }
    }

    apply(target/* , caster */) {
        const priorEffect = _.find(target.statusEffects, { effectName: this.effectName });
        if(priorEffect) {
            priorEffect.unapply(target);
        }

        this.turnsLeft = (this.baseDuration * this.multiplier) + 1; // base of 2 turns because it will decrement before the turn starts
        target.statusEffects.push(this);
    }

    unapply(target) {
        _.remove(target.statusEffects, { effectName: this.effectName });
    }

    numberToUtility(number) {
        if(number >= 100) return 'immensely';
        if(number >= 75)  return 'significantly';
        if(number >= 50)  return 'majorly';
        if(number >= 25)  return 'minorly';
        if(number >= 10)  return 'somewhat';
        return 'slightly';
    }

    preTurn() {}
    // postTurn() {} // not used

    blocksTurn() { return false; }
}