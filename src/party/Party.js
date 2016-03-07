
import _ from 'lodash';

import save from './functions/save';
import { generator, adjective, noun } from 'moniker';
import getPlayer from '../character/functions/getbyname';

const partyIdGenerator = generator([adjective, adjective, noun], { glue: ' ' });

export default class Party {
    constructor({ players, _id }) {
        this.players = players;
        this._id = _id;

        if(!this._id) {
            this.init();
        }

        this.isReady = Promise.all(_.map(this.players, getPlayer)).then(playerData => {
            this.playerData = playerData;
        });
    }

    init() {
        this._id = partyIdGenerator.choose();
        this.save();
    }

    playerJoin(player) {
        this.players.push(player.name);
        this.playerData.push(player);
        player.partyId = this._id;
        player.save();
        this.save();
    }

    playerLeave(player) {
        _.pull(this.players, player.name);
        _.remove(this.playerData, checkPlayer => checkPlayer.name === player.name);
        player.partyId = null;
        player.save();
        this.save();
    }

    notifyOfCombat(scWorker, battle) {
        if(this.players.length === 0) return;
        scWorker.exchange.publish(`party:${this._id}:battle`, battle.transmitObject());
    }

    notifyOfUpdates(scWorker) {
        if(this.players.length === 0) return;
        scWorker.exchange.publish(`party:${this._id}`, this.transmitObject());
    }

    transmitObject() {
        return _.omit(this, ['isReady']);
    }

    saveObject() {
        return _.omit(this, ['playerData', 'isReady']);
    }

    save() {
        save(this);
    }
}