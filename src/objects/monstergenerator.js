
import _ from 'lodash';
import crypto from 'crypto';
import Dice from 'dice.js';

import Logger from '../objects/logger';

import Monster from '../character/base/Monster';
import SkillManager from '../objects/skillmanager';
import TraitManager from '../objects/traitmanager';
import ItemGenerator from '../objects/itemgenerator';

import { weightedChoice, singleChoice } from '../functions/helpers';

const serverSalt = crypto.createHash('md5').update(''+Math.random()).digest('hex');

const ITEM_WEIGHTS = [
    { name: 0, weight: 10 },
    { name: 1, weight: 5 },
    { name: 2, weight: 2 },
    { name: 3, weight: 1 }
];


const chooseSkills = (possibleSkills, rating, seed, currentSkills = []) => {
    if(rating < 0) return currentSkills;
    const skills = _.cloneDeep(currentSkills);
    const availableSkills = _.reject(possibleSkills, skill => skill.spellDisabled || _.contains(['Flee', 'Item'], skill.spellName));

    // rating of 0 = 1 skill, rating of 5 = 6 skills
    for(let i=0; i<rating+1-currentSkills.length; i++) {

        // choose a skill based on seed+index
        const chosenSkill = singleChoice(availableSkills, seed+i);
        skills.push(chosenSkill.spellName);
    }

    return skills;
};

const chooseTraits = (possibleTraits, rating, seed, currentTraits = []) => {
    if(rating < 3) return currentTraits;
    const traits = _.cloneDeep(currentTraits);
    const availableTraits = _.reject(possibleTraits, trait => trait.traitDisabled);

    // rating of 0 = 1 skill, rating of 5 = 6 skills
    for(let i=0; i<rating+1-currentTraits.length; i++) {

        // choose a skill based on seed+index
        const chosenTrait = singleChoice(availableTraits, seed+i);
        traits.push(chosenTrait.traitName);
    }

    return traits;
};

export default async (baseOpts, availableMonsters) => {
    const opts = _.clone(baseOpts);

    const chosenMonster = weightedChoice(availableMonsters, opts.seed);

    opts.name = chosenMonster.name;
    opts.profession = chosenMonster.profession;
    opts.goldDrop = chosenMonster.goldDrop;
    opts.bonusXp = chosenMonster.bonusXp;
    opts.professionLevels = { [opts.profession]: opts.baseLevel };
    opts.equipment = { zone: { stats: baseOpts.statBuff } };

    // some monsters can have auxiliary classes
    if(chosenMonster.extendProfessions) {
        _.extend(opts.professionLevels, chosenMonster.extendProfessions);
    }

    opts.skills = chooseSkills(SkillManager.getSkills(opts), opts.rating, opts.seed, chosenMonster.skills);
    opts.traits = chooseTraits(TraitManager.getTraits(opts), opts.rating, opts.seed, chosenMonster.traits);

    const monster = new Monster(opts);

    if(chosenMonster.equipment) {
        const { weapon, armor, items } = chosenMonster.equipment;
        try {
            if(weapon && +Dice.roll('1d100') <= weapon) {
                const newWeapon = await ItemGenerator.generate({ playerReference: monster, type: 'weapon', seed: opts.seed+'weapon' });
                monster.equip(newWeapon);
            }

            if(armor  && +Dice.roll('1d100') <= armor) {
                const newArmor = await ItemGenerator.generate({ playerReference: monster, type: 'armor',  seed: opts.seed+'armor' });
                monster.equip(newArmor);
            }

            if(items && items.length > 0) {
                const numItems = weightedChoice(_.filter(ITEM_WEIGHTS, w => _.contains(items, w.name)), opts.seed+'itemcount').name;
                for(let i = 0; i < numItems; i++) {
                    monster.addToInventory(await ItemGenerator.generate({ playerReference: monster, type: 'consumable', seed: opts.seed+'item'+i }));
                }
            }
        } catch(e) {
            Logger.error('MonsterGenerate:Equipment', e);
        }
    }

    monster.verifyToken = generate(monster);

    return new Promise(resolve => {
        resolve(_.pick(monster, ['id', 'name', 'profession', 'inventory', 'goldDrop', 'equipment', 'professionLevels', 'skills', 'traits', 'location', 'rating', 'seed', 'verifyToken']));
    });
};

export const generate = (monster) => {
    const props = _.pick(monster, ['id', 'name', 'profession', 'inventory', 'goldDrop', 'equipment', 'professionLevels', 'skills', 'traits', 'location', 'rating', 'seed']);
    return crypto.createHash('md5').update(serverSalt + JSON.stringify(props)).digest('hex');
};

export const verify = (monster) => {
    const testToken = generate(monster);
    return testToken === monster.verifyToken;
};