const mongoose = require("mongoose")

module.exports = mongoose.model(
    "Aziz-ticket" , 
    mongoose.Schema({
           Guild: String,
          Channel: String,
          Category : String,
          message : String
        

})
)