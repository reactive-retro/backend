
import _ from 'lodash';

import DEFAULTS from '../static/chardefaults';
const professionHash = require('require-dir')('../character/professions', { recurse: true });

export const allProfessions = _(professionHash)
    .values()
    .map('default')
    .reduce((prev, cur) => {
        prev[cur.name] = cur;
        return prev;
    }, {});


export default class ProfessionManager {
    static getProfessionDescriptions() {
        return _.reduce(_.values(allProfessions), (prev, cur) => {
            prev[cur.name] = cur.description;
            return prev;
        }, {});
    }

    static meetsRequirement(player, profession) {
        const prereqs = profession.prerequisites;
        if(!prereqs) return true;
        return _.all(_.keys(prereqs), prof => player.professionLevels[prof] >= prereqs[prof]);
    }

    static getUnlockedProfessions(player) {
        const baseProfessions = DEFAULTS.unlockedProfessions;

        const unlockedProfessions = _(allProfessions)
            .values()
            .map(prof => this.meetsRequirement(player, prof) ? prof.name : null)

            // no, you can't unlock Monster
            .reject(prof => prof === 'Monster')
            .compact()
            .value();

        return _.uniq(baseProfessions.concat(unlockedProfessions));
    }
}