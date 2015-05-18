var pmongo = require('promised-mongo');
var _ = require('lodash');
var connectionString = 'mongodb://127.0.0.1/retro';

module.exports.run = function (worker) {
  var scServer = worker.scServer;

  var db = pmongo(connectionString, ['players']);

  scServer.on('connection', function (socket) {
    console.log('client connect');

    socket.on('login', function(credentials, respond) {
      console.log('begin login', credentials);
      var search = _.clone(credentials);
      delete search.profession;

      db.players.findOne(search).then(function(doc) {
        console.log(doc);
        if(doc) {
          respond(null, 'Login Successful');
        } else {
          respond(null, 'User Created')
        }
      });
    });
  });
};