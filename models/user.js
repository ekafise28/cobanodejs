var mongoose = require("mongoose");

// User Schema
var UserSchema = mongoose.Schema({
  name: {type: String,required: true},
  email: {type: String,required: true, unique: true},
  //username: {type: String,required: true, unique: true},
  password: {type: String,required: true},
  phone: {type: String},
  admin: {type: Number, default: 0},
  roles: {type: String},
  isVerified: {type:Boolean, default: false },
  passwordResetToken: {type: String},
  passwrodResetExpires:{type: Date},

  // akun
  address: {type: String},
  province: {type: String},
  kota_kab: {type: String},
  facebook: {type: String},
  instagram: {type: String},
  //membersince: 
  image: { type: String },

});

var User = (module.exports = mongoose.model("User", UserSchema));
