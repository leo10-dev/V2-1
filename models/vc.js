const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
    Guild: String,
    Role: Array, 
    Channel: String,
    Remove: String,
})

module.exports = mongoose.model('voicerole', Schema)