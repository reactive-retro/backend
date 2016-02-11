
import _ from 'lodash';

import getPlayer from '../../../character/functions/getbyname';
import { verify as monsterVerify } from '../../../objects/monstergenerator';
import MESSAGES from '../../../static/messages';
import createBattle from '../../../combat/functions/createbattle';
import save from '../../../character/functions/save';

export default (socket) => {

    const enterCombat = ({ name, monsters }, respond) => {

        const verified = _.map(monsters, monsterVerify);
        if(_.any(verified, bool => !bool)) {
            return respond({ msg: MESSAGES.BAD_MONSTER });
        }

        if(!name) {
            return respond({msg: MESSAGES.NO_NAME});
        }

        getPlayer(name, respond)
            .then(doc => {
                if(doc.battleId) {
                    return respond({msg: MESSAGES.ALREADY_IN_COMBAT});
                }

                const party = [doc];

                createBattle({
                    players: _.pluck(party, 'name'),
                    monsters
                }).then(battle => {

                    // assign the battle id to them
                    _.each(party, player => {
                        player.battleId = battle._id;
                        save(player);
                    });

                    socket.emit('combat:entered', battle);

                    return respond({msg: MESSAGES.BATTLE_ENTERED});
                }, () => {
                    return respond({msg: MESSAGES.BAD_COMBAT});
                })
                .catch(console.error);
        });
    };

    socket.on('combat:enter', enterCombat);
};