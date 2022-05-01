const mongoose = require("mongoose");

const boardSchema = mongoose.Schema({
    _id : {type : String, required : true, unique : true},
    name : {type : String, required : true},
    userID : {type : String, required : true}
});

module.exports = mongoose.model("Board", boardSchema);