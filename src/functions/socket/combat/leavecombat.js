
export default (socket) => {
    /*
     * When leavecombat is fired, battles are cleaned up (ie, removed from the DB), xp is awarded (or death-debuffs if players lose),
     * and all clients are told that combat is over. The client then gets sent to a rewards screen that shows all of the results,
     * with the (only) option to go back to the player/explore screen.
     */
};