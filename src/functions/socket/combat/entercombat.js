
import _ from 'lodash';

import getPlayer from '../../player/getbyname';
import { verify as monsterVerify } from '../../../objects/monstergenerator';
import MESSAGES from '../../../static/messages';
import createBattle from '../../combat/createbattle';
import save from '../../../functions/player/save';

export default (socket) => {
    /*
     * Client emits an event with the monster they would like to engage in combat
     * If the monster is valid (verifyToken), then combat is started (otherwise, an error message is sent back)
     * Combat starting consists of:
     *  - getting all party information (for both groups) in the db
     *  - sending all party members the id of the battle in the db (to verify they're in this battle)
     *  - forcing clients to subscribe to the 'battle:`id`' channel (http://socketcluster.io/#!/docs/basic-usage)
     *
     * Control is then handed off to chooseaction and roundresults.
     */

    const enterCombat = ({ name, monsters }, respond) => {
        const verified = _.map(monsters, monsterVerify);
        if(_.any(verified, bool => !bool)) {
            return respond({ msg: MESSAGES.BAD_MONSTER });
        }

        if(!name) {
            return respond({msg: MESSAGES.NO_NAME});
        }

        getPlayer(name, respond).then(doc => {
            if(doc.battleId) {
                return respond({msg: MESSAGES.ALREADY_IN_COMBAT});
            }

            const party = [doc];

            createBattle({
                players: _.pluck(party, 'name'),
                monsters
            }).then(battle => {

                console.log(battle);

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
        });
    };

    socket.on('combat:enter', enterCombat);
};