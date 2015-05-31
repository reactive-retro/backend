'use strict';

var argv = require('minimist')(process.argv.slice(2));
var SocketCluster = require('socketcluster').SocketCluster;

var socketCluster = new SocketCluster({
    workers: Number(argv.w) || 1,
    stores: Number(argv.s) || 1,
    port: Number(argv.p) || 8080,
    appName: argv.n || 'reactive-retro',
    workerController: __dirname + '/worker.js',
    storeController: __dirname + '/store.js',
    socketChannelLimit: 100,
    rebootWorkerOnCrash: argv['auto-reboot'] != false
});