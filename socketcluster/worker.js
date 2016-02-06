
import _ from 'lodash';
import path from 'path';
import fs from 'fs';

import clearBattle from '../src/functions/player/clearbattle';

export var run = (worker) => {
    const scServer = worker.scServer;

    scServer.on('error', e => console.error(e.message));
    scServer.on('notice', e => console.info(e));

    scServer.on('connection', socket => {

        socket.on('error', e => console.error(e.message));

        socket.on('disconnect', function() {
            if(!socket.getAuthToken()) return;
            const { heroname } = socket.getAuthToken();
            if(!heroname) return;

            // disconnect = lose battle
            clearBattle(heroname);
        });

        const normalizedPath = path.join(__dirname, '..', 'src', 'functions', 'socket');

        const allSocketFunctions = require('require-dir')(normalizedPath, { recurse: true });

        const requireRecursive = (obj) => {
            _.each(obj, (val) => {
                if(!val.default) return requireRecursive(val);
                val.default(socket);
            });
        };

        requireRecursive(allSocketFunctions);
    });
};