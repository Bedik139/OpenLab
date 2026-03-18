/**
 * Database Connection (Chrisander)
 *
 * Handles connecting and disconnecting from MongoDB.
 * Uses MONGODB_URI from .env file.
 */

const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URI;

function connectToDB() {
    return mongoose.connect(MONGO_URI);
}

function disconnect() {
    console.log('Disconnecting from MongoDB...');
    mongoose.disconnect();
}

function signalHandler() {
    disconnect();
    process.exit();
}

process.on('SIGINT', signalHandler);
process.on('SIGQUIT', signalHandler);
process.on('SIGTERM', signalHandler);

module.exports = {
    connect: connectToDB,
    disconnect: disconnect
};
