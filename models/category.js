var mongoose = require('mongoose');

// Category Schema
var CategorySchema = mongoose.Schema({
  judul: {type: String,require: true},
  judul2: {type: String},
  title: {type: String,require: true},
  slug: {type: String},
  image: { type: String },
  activeflag: {type: String}
})

var Category = module.exports = mongoose.model('Category', CategorySchema);