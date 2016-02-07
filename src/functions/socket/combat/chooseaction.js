
export default (socket) => {
    /*
     * Chooseaction is fired every time a client chooses an action.
     * It can be fired many times (to indicate a changing of actions), but is finalized by confirmaction -
     * confirmaction is only available if all party members have chosen their actions and are ready to confirm them.
     * When choosing an action, it will emit it to all players in the channel (which is the whole channel), minus
     * the chooser (they know they chose it, of course). The action will be displayed under their name,
     * as well as the target they chose.
     *
     * The server does not need to subscribe to the channel, only clients. Clients just pass around their targetting info that way.
     * A separate event should be emitted to send it to the server as well.
     *
     * Control is handed off to confirmaction at this point, when the user is ready.
     */

    // probably should check for a battle id everywhere
};