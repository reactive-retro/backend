
import q from 'q';
import _ from 'lodash';
import Dice from 'dice.js';

import { ActionTargets } from '../../character/base/Action';
import SkillManager from '../../objects/skillmanager';
import SpellEffectManager from '../../objects/spelleffectmanager';
import Monster from '../../character/base/Monster';
import getPlayer from '../../character/functions/getbyname';
import save from './../functions/save';

const randomBetween = (min, max) => Math.random() * (max - min) + min;

export default class Battle {
    constructor({players, monsters, _id, actions}) {
        this._id = _id;
        this.players = players;
        this.monsters = _.map(monsters, m => new Monster(m));
        this.actions = actions || {};

        this.isReady = q.all(_.map(this.players, getPlayer)).then(playerData => {
            this.playerData = playerData;
        });
    }

    getTargets(me, skill, fallback) {
        const isMonster = !!me.id;

        const allyArray = isMonster ? this.monsters : this.playerData;
        const enemyArray = isMonster ? this.playerData : this.monsters;

        switch(skill.spellTargets) {
            case ActionTargets.ALL: return this.playerData.concat(this.monsters);
            case ActionTargets.ALL_ALLY: return allyArray;
            case ActionTargets.ALL_ENEMY: return enemyArray;
            case ActionTargets.SELF: return [me];

            case ActionTargets.SINGLE_ALLY: return fallback ? [fallback] : [_.sample(allyArray)];
            case ActionTargets.SINGLE_ENEMY: return fallback ? [fallback] : [_.sample(enemyArray)];
            default:
                console.error('Invalid enemy targetting', skill, skill.spellTargets);
                return [];
        }
    }

    canAct(target) {
        if(target.stats.hp.atMin()) return '';

        const reasons = _(target.statusEffects)
            .map(eff => eff.blocksTurn(target))
            .compact()
            .value();

        if(_.any(reasons)) {
            return reasons[0];
        }

        return true;
    }

    applySkill(caster, skill, targets) {

        /*
         * multiplier affects:
         *  - damage
         *  - cooldown
         *  - duration
         *  - mp cost
         */
        let multiplier = Math.max(1, caster.calculateMultiplier(skill)); // monsters get a default multiplier of 1 for all skills

        caster.stats.mp.sub(skill.spellCost * multiplier);
        caster.addCooldown(skill.spellName, skill.spellCooldown * multiplier);

        const messages = [];

        const tryEffects = (skill, target) => {
            return _(skill.spellEffects)
                .pairs()
                .map(pair => {
                    const [effect, effData] = pair;
                    if(effect === 'Damage') return '';

                    if(Dice.roll('1d100') > effData.chance) return '';
                    const Proto = SpellEffectManager.getEffectByName(effect);
                    if(!Proto) {
                        console.error(`ERROR: No valid proto: ${Proto}`);
                        return;
                    }

                    const appliedEffect = new Proto({
                        duration: +Dice.roll(effData.roll),
                        multiplier,
                        statBuff: effData.statBuff,
                        casterName: caster.name,
                        skillName: skill.spellName
                    });

                    const applyMessage = appliedEffect.apply(target, caster);

                    return applyMessage;
                })
                .compact()
                .value();
        };

        // if you can do damage, you have to do damage for auxillary effects to occur
        if(skill.spellEffects.Damage) {
            _.each(targets, target => {
                const { chance, roll } = skill.spellEffects.Damage;
                const accuracyBonus = caster.stats.acc;

                if(+Dice.roll('1d100') > chance + accuracyBonus) {
                    messages.push(`${caster.name} missed ${target.name}!`);
                    return;
                }

                let offenseRoll = +Dice.roll('1d20') + accuracyBonus + caster.stats.dex + caster.stats.str;
                let defenseRoll = target.stats.dex;

                if(offenseRoll <= 0) offenseRoll = 1;
                if(defenseRoll <= 0) defenseRoll = 1;

                if(!skill.spellUnblockable && randomBetween(-defenseRoll, offenseRoll) < 0) {
                    messages.push(`${target.name} blocked ${caster.name}'s ${skill.spellName}!`);
                    return;
                }

                // do at least 1 damage
                const damage = Math.max(1, +Dice.roll(roll, caster.stats) * multiplier);
                const damageMessage = this.stringFormat(skill.spellUseString, {
                    target: target.name,
                    origin: caster.name,
                    damage,
                    skillName: skill.spellName
                });

                target.stats.hp.sub(damage);

                messages.push(damageMessage);
                if(target.stats.hp.atMin()) {
                    messages.push(`${target.name} was slain by ${caster.name}!`);
                } else {
                    const applyMessages = tryEffects(skill, target);
                    messages.push(...applyMessages);
                }

            });

        // if you don't do damage, you apply yourself immediately
        } else {
            _.each(targets, target => {
                messages.push(this.stringFormat(skill.spellUseString, {
                    target: target.name,
                    origin: caster.name,
                    skillName: skill.spellName
                }));
                messages.push(...tryEffects(skill, target));
            });
        }

        return messages;
    }

    checkPreTurnEffects(player) {
        const messages = [];

        _.each(player.statusEffects, (effect) => {
            const preTurn = effect.preTurn(player);
            if(preTurn) {
                messages.push(preTurn);
            }
            effect.decrementTurns(player);
            if(effect.turnsLeft <= 0) {
                messages.push(`${effect.effectName} on ${player.name} (Origin: ${effect.casterName}'s ${effect.skillName}) has expired.`);
            }
        });

        return messages;
    }

    takeTurn(id) {
        const me = this.getById(id);

        const preTurnMessages = this.checkPreTurnEffects(me);

        const canAct = this.canAct(me);
        if(_.isString(canAct)) {
            return _.compact([canAct]);
        }

        const validSkills = SkillManager.getSkills(me);

        const isMonster = this.isMonsterId(id);

        let targets = [];
        let skillRef = null;

        if(!isMonster) {
            let { skill, target } = this.actions[me.name];

            skillRef = _.find(validSkills, { spellName: skill });

            // no cheating
            // TODO regenerate, stealth (only works if party available)
            const multiplier = me.calculateMultiplier(skillRef);
            const isInvalidSkill = !skillRef
                                || !_.contains(me.skills, skill)
                                || me.stats.mp.lessThan(skillRef.spellCost * multiplier)
                                || me.isCoolingDown(skill);

            if(isInvalidSkill) {
                skillRef = _.find(validSkills, { spellName: 'Attack' });
            }

            targets = this.getTargets(me, skillRef, this.getById(target));
        } else {
            skillRef = _.sample(SkillManager.getCombatSkills(me));
            targets = this.getTargets(me, skillRef);
        }

        me.lowerAllCooldowns();

        const applyMessages = this.applySkill(me, skillRef, targets);

        return preTurnMessages.concat(applyMessages);
    }

    processActions() {
        if(!this.actions) return [];

        let results = [];

        const sortedTurnOrder = _.sortBy(this.playerData.concat(this.monsters), 'stats.dex').reverse();
        const turnsByName = _.map(sortedTurnOrder, (character) => character.id ? character.id : character.name);

        _.each(turnsByName, (character) => results.push(...this.takeTurn(character)));

        this.actions = {};
        _.each(this.playerData, player => {
            player.save()
        });
        this.save();

        const endMessages = this.checkCombatEnd() || [];
        results = results.concat(endMessages);

        if(endMessages.length > 0) {
            this.battleOver();
        }

        return results;
    }

    checkCombatEnd() {
        const isDead = (target) => target.stats.hp.atMin();
        if(_.all(this.playerData, isDead)) return this.playerLose();
        if(_.all(this.monsters, isDead)) return this.playerWin();
    }

    playerWin() {
        return [
            'You win!',
            'You earned 0 XP and got 0 Gold.',
            'You found a Knife!'
        ];
    }

    playerLose() {
        _.each(this.playerData, player => {
            player.fullheal();
        });
        return [
            'You lost!'
        ];
    }

    battleOver() {
        this.isDone = true;
        _.each(this.playerData, player => {
            _.each(player.statusEffects, effect => effect.unapply(player));
            player.cooldowns = {};
            player.battleId = null;
            player.save();
        });

        this.save();
    }

    stringFormat(string = '', { target = '', origin = '', damage = 0, skillName = '', result = '' }) {
        return string
            .split('%t').join(target)
            .split('%o').join(origin)
            .split('%d').join(Math.abs(damage).toString())
            .split('%r').join(result)
            .split('%n').join(skillName);
    }

    getById(id) {
        if(this.isMonsterId(id)) {
            return _.find(this.monsters, { id });
        }
        return _.find(this.playerData, { name: id })
    }

    // guids are >20 chars, char names are capped at 19 chars
    isMonsterId(testId) {
        return testId.length > 20;
    }

    saveObject() {
        return _.omit(this, ['playerData', 'isReady']);
    }

    save() {
        save(this);
    }
}