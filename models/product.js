var mongoose = require("mongoose");

// Product Schema
var ProductSchema = mongoose.Schema({
  id_adv: { type: Number },
  
  category: { type: String, require: true },
  title: { type: String, require: true },
  slug: { type: String },
  desc: { type: String },
  price: { type: Number },
  
  email: { type: String },// id

  discount: { type: Number},
  negotiable: { type: Number },
  uploaddate: { type: Date, default: Date.now },
  sellername: { type: String },
  galery: { type: String },
  phone: { type: String },
  address: { type: String },
  kota_kab: { type: String },
  province: { type: String },
  image: { type: String },
  image1: { type: String },
  image2: { type: String },
  image3: { type: String },
  image4: { type: String },
  totalviewer: { type: Number },
  activeflag: { type: String },
  //new documents
  sms: { type: String },
  wa: { type: String },
  media: { type: String },
  tahun: { type: String },
  ukuran: { type: String },
  seniman: { type: String },

});

var Product = (module.exports = mongoose.model("Product", ProductSchema));
