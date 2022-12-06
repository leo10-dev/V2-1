const mongoose = require("mongoose")

module.exports = mongoose.model(
    "mute-roles" , 
    mongoose.Schema({
        Guild: String,
        Role: String,

})
)