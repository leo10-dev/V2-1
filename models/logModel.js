const mongoose = require("mongoose")

module.exports = mongoose.model(
    "log-chh" , 
    mongoose.Schema({
        Guild : String,
    Channel : String,
    
        

})
)