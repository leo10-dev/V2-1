const mongoose = require("mongoose")

module.exports = mongoose.model(
    "log-channel-Dash" , 
    mongoose.Schema({
        Guild : String,
    Channel : String,
    
        

})
)