
import _ from 'lodash';
import path from 'path';
import fs from 'fs';

export var run = (worker) => {
    const scServer = worker.scServer;

    scServer.on('error', console.error);
    scServer.on('notice', console.info);

    scServer.on('connection', socket => {

        socket.on('error', e => {
            console.error(e.message);
        });

        socket.on('disconnect', () => {
            console.log('Someone disconnected!');
        });

        const normalizedPath = path.join(__dirname, '..', 'src', 'functions', 'socket');

        _.each(fs.readdirSync(normalizedPath), file => {
            require(`../src/functions/socket/${file}`).default(socket);
        });
    });
};