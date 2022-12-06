
const mongoose = require('mongoose');
module.exports = mongoose.model(
    'Send-code',
    new mongoose.Schema({
       id : Intgeer,
       code : String,
    })
);