
import q from 'q';
import _ from 'lodash';
import Dice from 'dice.js';

import { ActionTargets } from '../../character/base/Action';
import SkillManager from '../../objects/skillmanager';
import SpellEffectManager from '../../objects/spelleffectmanager';
import Monster from '../../character/base/Monster';
import getPlayer from '../../character/functions/getbyname';
import save from './../functions/save';

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
        let multiplier = caster.calculateMultiplier(skill);
        if(skill.spellName === 'Attack') {
            multiplier += 1;
        }

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

                // TODO factor in dex for blocking, maybe roll(-opponent.dex, my.dex) and if positive, you aren't blocked
                if(+Dice.roll('1d100') > chance + accuracyBonus) {
                    messages.push(`${caster.name} missed ${target.name}!`);
                    return;
                }
                const damage = +Dice.roll(roll, caster.stats) * multiplier;
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
                messages.push(`${effect.effectName} on ${player.name} (Origin: ${effect.casterName} | ${effect.skillName}) has expired.`);
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

            // no cheating
            // TODO cooldowns (display with clock next to skill name)
            // TODO mp cost (display with droplet next to skill name)
            if(!_.contains(me.skills, skill)) { skill = 'Attack'; }
            skillRef = _.find(validSkills, { spellName: skill });
            targets = this.getTargets(me, skillRef, this.getById(target));
        } else {
            skillRef = _.sample(validSkills);
            targets = this.getTargets(me, skillRef);
        }

        const applyMessages = this.applySkill(me, skillRef, targets);

        return preTurnMessages.concat(applyMessages);
    }

    processActions() {
        if(!this.actions) return [];

        let results = [];

        const sortedTurnOrder = _.sortBy(this.playerData.concat(this.monsters), 'stats.dex');
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