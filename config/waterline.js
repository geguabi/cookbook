var memoryAdapter = require('sails-memory');
var diskAdapter = require('sails-disk');

// konfiguráció
module.exports = {
    adapters: {
        memory:     memoryAdapter,
        disk:       diskAdapter,
    },
    connections: {
        default: {
            //adapter: 'disk',
           adapter: 'memory',  // minden szerver újraindításnál kiürül a hibalista, ha memoryban tárolunk
        },
        memory: {
            adapter: 'memory'
        },
        disk: {
            adapter: 'disk'
        },
    },
    defaults: {
        migrate: 'alter'
    },
};