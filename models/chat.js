var mongoose = require("mongoose");

// chat Schema
var chatSchema = mongoose.Schema({ 
  product: {type: String},
  name: {type: String,required: true},
  emailsender: {type: String,required: true},
  emailreceiver: {type: String,required: true },
  sendtime: { type: Date, required: true},
  message: {type: String,required: true, unique: true},
  readstatus: {type:String},
});

var Chat = (module.exports = mongoose.model("Chat", chatSchema));
