
import addBattleAction from '../../../combat/functions/addbattleaction';
import getPlayer from '../../../character/functions/getbyname';
import MESSAGES from '../../../static/messages';

export default (socket, scWorker) => {
    /*
     * Confirmaction is sent to the server when a user is definitely ready to confirm their action.
     * Upon confirming, their action choices are all locked and the server will wait for all users to confirm actions.
     * If this confirmaction is the last one needed, roundresults will run.
     */

    const confirmAction = ({ name, target, skill }, respond) => {

        if(!name) {
            return respond({msg: MESSAGES.NO_NAME});
        }

        if(!target) {
            return respond({msg: MESSAGES.NO_COMBAT_TARGET});
        }

        if(!skill) {
            return respond({msg: MESSAGES.NO_COMBAT_SKILL});
        }

        getPlayer(name, respond).then(player => {
            if(!player.battleId) {
                return respond({msg: MESSAGES.NOT_IN_COMBAT});
            }

            addBattleAction(player.battleId, { name, target, skill }).then(battle => {
                respond({msg: MESSAGES.CONFIRMED_SKILL});

                if(!battle.isReadyToProcess) return;

                try {
                    const actions = battle.processActions();
                    scWorker.exchange.publish(`battle:${battle._id}:results`, { battle, actions, isDone: battle.isDone });
                } catch(e) {
                    console.error(e);
                }
            });
        });

    };

    socket.on('combat:confirmaction', confirmAction);
};