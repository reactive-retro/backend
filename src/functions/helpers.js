'use strict';

var uuid = require('node-uuid');

module.exports.itemId = function() {
    return uuid.v4();
};