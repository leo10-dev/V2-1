const mongoose = require('mongoose');

module.exports = mongoose.model(
    'customCommand',
    new mongoose.Schema({
        userId: String,
        userName: String,
        guildId: String,
        guildName: String,
        trigger: String,
        response: String,
        timestamp: Number,
    })
);