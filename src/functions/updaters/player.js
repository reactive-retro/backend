
import Logger from '../../objects/logger';

import nearbyMonsters from '../world/nearbymonsters';
import nearbyPlaces from '../world/nearbyplaces';

export default async (socket, player, emitPlayer = true) => {
    if(emitPlayer) {
        socket.emit('update:player', player);
    }

    if(player.needsMonsterRefresh) {
        try {
            const monsters = await nearbyMonsters(player.homepoint, player.currentLevel);
            socket.emit('update:monsters', monsters);
        } catch(e) {
            Logger.error('UpdatePlayer:Monsters', e);
        }
    }

    if(player.sendPlaces) {
        try {
            const places = await nearbyPlaces(player.homepoint, player);
            socket.emit('update:places', places);
        } catch(e) {
            Logger.error('UpdatePlayer:Places', e);
        }
    }
};