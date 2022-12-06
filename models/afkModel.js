const mongoose = require("mongoose")

module.exports = mongoose.model(
    "afk" , 
    mongoose.Schema({
        userId: String,
        guildId: String,
        status: String,
        time: String,
       // isAfk: Boolean
})
)