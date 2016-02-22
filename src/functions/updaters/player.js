
import nearbymonsters from '../world/nearbymonsters';

export default (socket, player, emitPlayer = true) => {
    if(emitPlayer) {
        socket.emit('update:player', player);
    }

    if(player.needsMonsterRefresh) {
        const monsters = nearbymonsters(player.homepoint);
        socket.emit('update:monsters', monsters);
    }
}