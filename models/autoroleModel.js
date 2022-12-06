const mongoose = require("mongoose")

module.exports = mongoose.model(
    "crole" , 
    mongoose.Schema({
        GuildId: String,
        Role: Object,

})
)