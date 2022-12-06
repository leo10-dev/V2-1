const mongoose = require("mongoose")

module.exports = mongoose.model(
    "warnings" , 
    mongoose.Schema({
        userId: String,
        gulidId: String,
        moderatorId: String,
        reason: String,
        timestamp: Number,

})
)