
import nearbyMonsters from '../world/nearbymonsters';

export default async (socket, player, emitPlayer = true) => {
    if(emitPlayer) {
        socket.emit('update:player', player);
    }

    if(player.needsMonsterRefresh) {
        const monsters = await nearbyMonsters(player.homepoint, player.currentLevel);
        socket.emit('update:monsters', monsters);
    }
}