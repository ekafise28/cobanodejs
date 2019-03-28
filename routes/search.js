var express = require("express");
var router = express.Router();
var Product = require("../models/product");

//--coba

router.get('/:title', function(req, res) {
    var titles = req.params.title;
     Product.find({$or:[{ title:  { "$regex": titles, "$options": "i" }},{ seniman: { "$regex": titles, "$options": "i" }},{ galery: { "$regex": titles, "$options": "i" }},{ tahun: { "$regex": titles, "$options": "i" }}]},function(err, products) {
       if (err) console.log(err);
       res.render("searchs", {
                 products: products,
                 pesan: "Produk tidak ditemukan",
       });
     });
 });

 module.exports = router;
