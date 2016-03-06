
import _ from 'lodash';
import path from 'path';
import Logger from '../src/objects/logger';

import logout from '../src/character/functions/logout';

export const run = (worker) => {
    const scServer = worker.scServer;

    scServer.on('error', e => Logger.error('SC:Server', e));

    scServer.on('connection', socket => {

        socket.on('error', e => Logger.error('SC:Socket', e));

        socket.on('disconnect', function() {
            if(!socket.getAuthToken()) return;
            const { heroname } = socket.getAuthToken();
            if(!heroname) return;

            // disconnect = lose battle
            logout(heroname, worker);
        });

        const normalizedPath = path.join(__dirname, '..', 'src', 'functions', 'socket');

        const allSocketFunctions = require('require-dir')(normalizedPath, { recurse: true });

        const requireRecursive = (obj) => {
            _.each(obj, (val) => {
                if(!val.default) return requireRecursive(val);
                val.default(socket, worker);
            });
        };

        try {
            requireRecursive(allSocketFunctions);
        } catch(e) {
            Logger.error('SC:Socket:Function', e);
        }
    });
};