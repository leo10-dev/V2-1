const mongoose = require("mongoose")

module.exports = mongoose.model(
    "voice-log" , 
    mongoose.Schema({
        Guild: String,
        Channel: String,

})
)