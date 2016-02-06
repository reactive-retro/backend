
export default (socket) => {
    /*
     * Confirmaction is sent to the server when a user is definitely ready to confirm their action.
     * Upon confirming, their action choices are all locked and the server will wait for all users to confirm actions.
     * If this confirmaction is the last one needed, roundresults will run.
     */
};