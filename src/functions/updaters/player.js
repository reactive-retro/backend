
import nearbyMonsters from '../world/nearbymonsters';
import nearbyPlaces from '../world/nearbyplaces';

export default async (socket, player, emitPlayer = true) => {
    if(emitPlayer) {
        socket.emit('update:player', player);
    }

    if(player.needsMonsterRefresh) {
        const monsters = await nearbyMonsters(player.homepoint, player.currentLevel);
        socket.emit('update:monsters', monsters);
    }

    if(player.sendPlaces) {
        const places = await nearbyPlaces(player.homepoint);
        socket.emit('update:places', places);
    }
};