var mongoose = require('mongoose');
// Page Schema
var provinceSchema = mongoose.Schema({
  title: {
    type: String,
    require: true
  },
  slug: {
    type: String,
  },
  activeflag: {
    type: String
  }
})

var Province = module.exports = mongoose.model('Province', provinceSchema);