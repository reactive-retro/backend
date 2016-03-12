
import _ from 'lodash';

import Logger from '../../objects/logger';

import nearbyMonsters from '../world/nearbymonsters';
import nearbyPlaces from '../world/nearbyplaces';

import SETTINGS from '../../static/settings';

export default async (socket, player, emitPlayer = true) => {
    if(emitPlayer) {
        socket.emit('update:player', player);
    }

    if(player.needsMonsterRefresh) {
        try {
            const args = _.extend(_.cloneDeep(SETTINGS.MONSTER_GENERATION.PLAYER), player.homepoint, { playerLevel: player.currentLevel });
            const monsters = await nearbyMonsters(args);
            socket.emit('update:monsters', monsters);
        } catch(e) {
            Logger.error('UpdatePlayer:Monsters', e);
        }
    }

    if(player.sendPlaces) {
        try {
            const places = await nearbyPlaces(player.homepoint, player);

            const placeMonsters = [];
            _.each(places, place => {
                if(!place.fullRequirements) return;
                placeMonsters.push(...place.fullRequirements);
                place.fullRequirements = null;
            });

            socket.emit('update:places', places);
            if(placeMonsters.length > 0) {
                socket.emit('update:monsters:push', placeMonsters);
            }
        } catch(e) {
            Logger.error('UpdatePlayer:Places', e);
        }
    }
};