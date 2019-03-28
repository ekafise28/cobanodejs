var mongoose = require('mongoose');

// Page Schema
var kota_kabSchema = mongoose.Schema({
  province: {
    type: String,
    // require: true
  },
  name: {
    type: String,
    // require: true
  },
  slug: {
    type: String,
  },
  activeflag: {
    type: String
  }
})

var Kota_kab = module.exports = mongoose.model('Kota_kab', kota_kabSchema);