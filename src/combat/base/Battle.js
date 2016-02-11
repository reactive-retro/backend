
import q from 'q';
import _ from 'lodash';
import Dice from 'dice.js';

import { ActionTargets } from '../../character/base/Action';
import SkillManager from '../../objects/skillmanager';
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
        switch(skill.spellTargets) {
            case ActionTargets.ALL: return this.playerData.concat(this.monsters);
            case ActionTargets.ALL_ALLY: return isMonster ? this.monsters : this.playerData;
            case ActionTargets.ALL_ENEMY: return isMonster ? this.playerData : this.monsters;
            case ActionTargets.SELF: return [me];

            case ActionTargets.SINGLE_ALLY: return [fallback];
            case ActionTargets.SINGLE_ENEMY: return [fallback];
            default:
                console.error('Invalid enemy targetting', skill, skill.spellTargets);
                return [];
        }
    }

    canAct(target) {
        if(target.stats.hp.atMin()) return '';

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
        let multiplier = _.filter(caster.skills, check => check === skill.spellName).length;
        if(skill.spellName === 'Attack') {
            multiplier += 1;
        }

        const messages = [];

        const tryEffects = (skill, target) => {
            return _.compact(_.reduce(skill.spellEffects, (effData, effect) => {
                if(effect === 'Damage') return '';
            }));
        };

        if(skill.spellEffects.Damage) {
            _.each(targets, target => {
                const { chance, roll } = skill.spellEffects.Damage;
                if(+Dice.roll('1d100') > chance) return [`${caster} missed ${target.name}!`];
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
                    messages.push(...tryEffects(skill, target));
                }

            });
        }

        return messages;
    }

    takeTurn(id) {
        const me = this.getById(id);

        const canAct = this.canAct(me);
        if(!canAct) {
            return _.compact([canAct]);
        }

        const validSkills = SkillManager.getSkills(me);

        const isMonster = this.isMonsterId(id);

        let targets = [];
        let skillRef = null;

        if(!isMonster) {
            let { skill, target } = this.actions[me.name];

            // no cheating
            if(!_.contains(me.skills, skill)) { skill = 'Attack'; }
            skillRef = _.find(validSkills, { spellName: skill });
            targets = this.getTargets(me, skillRef, this.getById(target));
        } else {
            skillRef = _.sample(validSkills);
            const target = _.sample(this.playerData);
            targets = this.getTargets(me, skillRef, target);
        }

        return this.applySkill(me, skillRef, targets);
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

    /*
     * TODO
     * - apply effects (burn, etc) - semaphore - { Burn: { turnsLeft: 1, damagePerTurn: 3 } }
     *      -> probably make separate classes for all of these effects and have a general "effect" class
     *      -> make it have an "apply" function that applies it to a target
     */

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
            player.statusEffects = {};
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