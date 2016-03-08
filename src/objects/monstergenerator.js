
import _ from 'lodash';
import crypto from 'crypto';
import Dice from 'dice.js';

import Logger from '../objects/logger';

import Monster from '../character/base/Monster';
import SkillManager from '../objects/skillmanager';
import ItemGenerator from '../objects/itemgenerator';

import { weightedChoice, singleChoice } from '../functions/helpers';

const serverSalt = crypto.createHash('md5').update(''+Math.random()).digest('hex');

const chooseSkills = (possibleSkills, rating, seed, currentSkills = []) => {
    if(rating < 0) return currentSkills;
    const skills = _.cloneDeep(currentSkills);
    const availableSkills = _.reject(possibleSkills, skill => skill.spellDisabled);

    // rating of 0 = 1 skill, rating of 5 = 6 skills
    for(let i=0; i<rating+1-currentSkills.length; i++) {

        // choose a skill based on seed+index
        const chosenSkill = singleChoice(availableSkills, seed+i);
        skills.push(chosenSkill.spellName);
    }

    return skills;
};

export default async (baseOpts, availableMonsters) => {
    const opts = _.clone(baseOpts);

    const chosenMonster = weightedChoice(availableMonsters, opts.seed);

    opts.name = chosenMonster.name;
    opts.profession = chosenMonster.profession;
    opts.goldDrop = chosenMonster.goldDrop;
    opts.bonusXp = chosenMonster.bonusXp;
    opts.professionLevels = { [opts.profession]: opts.baseLevel };

    // some monsters can have auxiliary classes
    if(chosenMonster.extendProfessions) {
        _.extend(opts.professionLevels, chosenMonster.extendProfessions);
    }

    opts.skills = chooseSkills(SkillManager.getSkills(opts), opts.rating, opts.seed, chosenMonster.skills);

    const monster = new Monster(opts);

    if(chosenMonster.equipment) {
        const { weapon, armor } = chosenMonster.equipment;
        try {
            if(weapon && +Dice.roll('1d100') <= weapon) monster.equip(await ItemGenerator.generate(monster, 'weapon', opts.seed+'weapon'));
            if(armor  && +Dice.roll('1d100') <= armor)  monster.equip(await ItemGenerator.generate(monster, 'armor',  opts.seed+'armor'));
        } catch(e) {
            Logger.error('MonsterGenerate:Equipment', e);
        }
    }

    monster.verifyToken = generate(monster);

    return new Promise(resolve => {
        resolve(_.pick(monster, ['name', 'profession', 'goldDrop', 'equipment', 'professionLevels', 'skills', 'location', 'rating', 'seed', 'verifyToken']));
    });
};

export const generate = (monster) => {
    const props = _.pick(monster, ['name', 'profession', 'goldDrop', 'equipment', 'professionLevels', 'skills', 'location', 'rating', 'seed']);
    return crypto.createHash('md5').update(serverSalt + JSON.stringify(props)).digest('hex');
};

export const verify = (monster) => {
    const testToken = generate(monster);
    return testToken === monster.verifyToken;
};