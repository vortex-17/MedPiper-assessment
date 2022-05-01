const mongoose = require("mongoose");


const todoSchema = mongoose.Schema({
    _id : {type: String, required: true, unique : true},
    userID : {type : String, required : true},
    boardID : {type  : String, required : true},
    status : {type : String, required : true},
    task: {type: String, required: true},
    date : {type : String},
    time : {type : Number},
});

module.exports = mongoose.model("Todo", todoSchema);