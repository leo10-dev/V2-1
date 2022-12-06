const mongoose = require("mongoose")

module.exports = mongoose.model(
    "blacklist" , 
    mongoose.Schema({
        id : String

})
)