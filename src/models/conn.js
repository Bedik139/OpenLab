/**
 * Database Connection (Chrisander)
 *
 * Handles connecting and disconnecting from MongoDB.
 * Uses MONGODB_URI from .env file.
 */

const mongoose = require('mongoose');

// MongoDB connection string from environment variables
const MONGO_URI = process.env.MONGODB_URI;

/*
 * These listeners provide feedback on the connection status.
 * They will log messages to the console when the connection is established,
 * encounters an error, or is disconnected.
 */

// Shows when successfully connected to MongoDB
mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
});

// Shows when the connection throws an error
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

// Shows when the connection is disconnected
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

/*
 * This function connects to MongoDB using the MONGO_URI from environment variables.
 * It also includes error handling to ensure that if the URI is not defined,
 * an appropriate error is thrown.
 */
function connectToDB() {
    if (!MONGO_URI) {
        throw new Error('MONGODB_URI is not defined in environment variables');
    }

    return mongoose.connect(MONGO_URI); 
}

// Disconnect from MongoDB
function disconnect() {
    console.log('Disconnecting from MongoDB...');
    return mongoose.disconnect();
}

/*
 * This function handles process termination signals.
 * It also ensures database connection is closed before exiting.
 */
function signalHandler() {
    disconnect()
        // Add message to indicate we're exiting the process after disconnecting
        .then(() => {
            console.log('MongoDB disconnected. Exiting process.');
            process.exit(0);
        })
        // Add message to indicate an error occurred during disconnecting
        .catch((err) => {
            console.error('Error during MongoDB disconnect:', err);
            process.exit(1);
        });
}

// Listen for termination signals (Ctrl+C, kill, etc.)
process.on('SIGINT', signalHandler); // Handle Ctrl+C
process.on('SIGQUIT', signalHandler); // Quit signal
process.on('SIGTERM', signalHandler); // Termination signal

// Export connection utilities
module.exports = {
    connect: connectToDB,
    disconnect: disconnect
};