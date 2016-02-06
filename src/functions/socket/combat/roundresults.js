
export default (socket) => {
    /*
     * roundresults is where all the magic happens.
     *
     * Turns are ordered from highest speed to lowest speed, and those actions are enacted on whatever target they chose.
     * Basic monsters will choose a random action. More advanced AI will occur in those monsters that are in special places,
     * like dungeons. Some monsters may even have a set AI they follow (think boss monsters).
     *
     * There will have to be an ActionHandler or something that can be passed a sequence of actions, as well
     * as players / monsters (just to check what buffs/debuffs are on them, as well as make sure no strange number
     * operations happen).
     *
     * An event is emitted back to all clients in the channel with each action that happened, and the results of each action.
     * A structure would probably be { action: attack, target: monster, result: x damage, blind } or something.
     * The client is now free to choose a new action.
     *
     * After all monsters or all players are dead, control turns to leavecombat.
     */
};