const mongoose = require("mongoose")

module.exports = mongoose.model(
    "welcome-channel" , 
    mongoose.Schema({
        Guild: String,
        Channel: String,

})
)