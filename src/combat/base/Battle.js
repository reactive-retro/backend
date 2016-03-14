
import _ from 'lodash';
import Dice from 'dice.js';

import Logger from '../../objects/logger';
import XPCalculator from '../../objects/xpcalculator';
import { ActionTargets } from '../../character/base/Action';
import SkillManager from '../../objects/skillmanager';
import SpellEffectManager from '../../objects/spelleffectmanager';
import Monster from '../../character/base/Monster';
import getPlayer from '../../character/functions/getbyname';
import save from './../functions/save';
import { itemId } from '../../functions/helpers';

const randomBetween = (min, max) => Math.random() * (max - min) + min;

export default class Battle {
    constructor({ players, monsters, _id, actions }) {
        this._id = _id;
        this.players = players;
        this.monsters = _.map(monsters, m => new Monster(m));
        this.actions = actions || {};
        this.setReadyToProcess();

        this.isReady = Promise.all(_.map(this.players, getPlayer)).then(playerData => {
            this.playerData = playerData;
        });
    }

    setReadyToProcess() {
        this.isReadyToProcess = _.all(this.players, player => this.actions[player]);
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
                Logger.error('Combat:Target', new Error('Invalid enemy targetting'), skill);
                return [];
        }
    }

    canAct(target) {
        if(target.stats.hp.atMin() || target.isFled) return '';

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
        const multiplier = Math.max(1, caster.calculateMultiplier(skill.spellName)); // monsters get a default multiplier of 1 for all skills

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
                        Logger.error('Combat:Effects', new Error(`ERROR: No valid proto: ${Proto}`));
                        return;
                    }

                    let appliedEffect = null;

                    if(effData.instant) {
                        appliedEffect = new Proto({
                            multiplier,
                            statBuff: caster.rollDice(skill.spellName, effData.roll),
                            casterName: caster.name,
                            skillName: skill.spellName
                        });

                    } else {
                        appliedEffect = new Proto({
                            duration: caster.rollDice(skill.spellName, effData.roll),
                            multiplier,
                            statBuff: effData.statBuff,
                            casterName: caster.name,
                            skillName: skill.spellName
                        });
                    }

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

                if(target.isFled) {
                    messages.push(`${caster.name} swung at ${target.name}, but ${target.name} has fled the battle!`);
                    return;
                }
                if(target.stats.hp.atMin()) {
                    messages.push(`${caster.name} swung at ${target.name}, but ${target.name} is already dead!`);
                    return;
                }

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
                const damage = Math.max(1, caster.rollDice(skill.spellName, roll));
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
            const { skill, target } = this.actions[me.name];

            skillRef = _.find(validSkills, { spellName: skill });

            // no cheating
            const multiplier = me.calculateMultiplier(skillRef);
            const isInvalidSkill = !skillRef
                                || !_.contains(me.skills.concat(['Flee']), skill)
                                || me.stats.mp.lessThan(skillRef.spellCost * multiplier)
                                || me.isCoolingDown(skill);

            if(isInvalidSkill) {
                skillRef = _.find(validSkills, { spellName: 'Attack' });
            }

            targets = this.getTargets(me, skillRef, this.getById(target));
        } else {
            // monsters can't flee :(
            const allSkills = _.reject(SkillManager.getSkills(me), skill => skill.spellName === 'Flee');
            const mySkillObjects = _.map(me.skills.concat('Attack'), skillName => _.find(allSkills, { spellName: skillName }));
            skillRef = _.sample(SkillManager.getCombatSkills(me, mySkillObjects));
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
            player.save();
        });
        this.save();

        const endMessages = this.checkCombatEnd() || [];
        results = results.concat(endMessages);

        if(endMessages.length > 0) {
            this.battleOver();
        }

        return _.uniq(results);
    }

    checkCombatEnd() {
        const isDead = (target) => target.stats.hp.atMin();
        const isFled = (target) => target.isFled;

        if(_.all(this.playerData, isFled)) return this.playerFled();
        if(_.all(this.playerData, isDead)) return this.playerLose();
        if(_.all(this.monsters, isDead)) return this.playerWin();
    }

    playerWin() {
        const totalLuckBonus = 100 + _.reduce(this.playerData, (prev, cur) => prev + cur.stats.luk, 0);

        const droppedItems = _(this.monsters).map(monster => {
            const { armor, weapon } = monster.equipment;
            return [
                armor && armor.dropRate  && +Dice.roll('1d100') <= armor.dropRate  + totalLuckBonus ? armor : null,
                weapon && weapon.dropRate && +Dice.roll('1d100') <= weapon.dropRate + totalLuckBonus ? weapon : null
            ];
        }).flatten().compact().value();

        const messages = [
            'Heroes win!'
        ];

        let goldGained = _.reduce(this.monsters, (prev, monster) => prev + +Dice.roll(monster.goldDrop), 0);
        const xpGained = _.reduce(this.monsters, (prev, monster) => prev + XPCalculator.givenXp(monster), 0);

        // adjust monster level back to normal
        const avgMonsterLevel = _.reduce(this.monsters, (prev, monster) => prev + monster.currentLevel - monster.rating, 0);

        let playersWithAvailableSpace = _.filter(this.playerData, player => !player.stats.hp.atMin() && player.canAddToInventory());

        // we need to calculate these first, but show the messages last
        const itemMessages = [];
        const leftoverItems = _.filter(droppedItems, item => {
            if(playersWithAvailableSpace.length === 0) return true;
            const chosenPlayer = _.sample(playersWithAvailableSpace);
            item.itemId = itemId();
            chosenPlayer.addToInventory(item);
            itemMessages.push(`${chosenPlayer.name} found ${item.name}!`);
            playersWithAvailableSpace = _.filter(this.playerData, player => player.canAddToInventory());
        });

        // turn any extra items into gold
        _.each(leftoverItems, item => goldGained += item.value);

        const goldPerPerson = Math.floor(goldGained/this.players.length);

        _.each(this.playerData, player => {

            // you only get rewards if you were alive
            if(player.stats.hp.atMin()) return;
            player.addGold(goldPerPerson);
            const leveledUp = player.addXP(XPCalculator.calcXPForPerson({
                xpGained: xpGained,
                player,
                levelToAdjustFor: avgMonsterLevel,
                partySize: this.players.length-1
            }));
            messages.push(`${player.name} earned ${xpGained} XP and got ${goldPerPerson} Gold.`);
            if(leveledUp) {
                messages.push(`${player.name} has reached ${player.profession} level ${player.currentLevel}!`);
            }

            _.each(this.monsters, monster => {
                const key = monster.isDungeon ? 'dungeonMonster' : 'monster';
                player.markActionTaken(key, monster.id);
            });
        });

        return messages.concat(itemMessages);
    }

    playerFled() {
        return [
            'Heroes fled!'
        ];
    }

    playerLose() {
        return [
            'Heroes lost!'
        ];
    }

    battleOver() {
        this.isDone = true;
        _.map(this.playerData, player => {
            _.each(player.statusEffects, effect => effect.unapply(player));

            // heal dead allies
            if(player.stats.hp.atMin()) player.fullheal();

            player.cooldowns = {};
            player.battleId = null;
            return player.save();
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
        return _.find(this.playerData, { name: id });
    }

    // guids are >20 chars, char names are capped at 19 chars
    isMonsterId(testId) {
        return testId.length > 20;
    }

    transmitObject() {
        return _.omit(this, ['isReady']);
    }

    saveObject() {
        return _.omit(this, ['playerData', 'isReady']);
    }

    save() {
        save(this);
    }
}