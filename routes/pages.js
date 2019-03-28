var express = require("express");
var router = express.Router();

// Get Page model
var Page = require("../models/page");
var Product = require("../models/product");

// export
module.exports = router;
// Get Home / index
router.get("/", function(req, res) {
  Page.findOne({ slug: "home" }, function(err, page) {    
    if (err) console.log(err);
    Product.find(function(err, products) {
      if (err) console.log(err);
  
      // res.render("all_products", {
      //   title: "All products",
      //   products: products
      // });

      res.render("home", {
        title: "Kategori",
        products: products
      })

    });

  });
});

// Get a page
router.get("/:slug", function(req, res) {
  var slug = req.params.slug;

  Page.findOne({ slug: slug }, function(err, page) {
    if (err) console.log(err); 

    if (!page) {
      res.redirect("/");
    } else {

      User.findOne({ email: emailaccount }, function(err, user) {
  
        if (err) console.log(err); 
        res.cookie('ssiiffdd12309887zxcvasdf123112313id',user._id);  
      
        res.render("index", {
          title: page.title,
          content: page.content,
          idid: req.cookies['ssiiffdd12309887zxcvasdf123112313id'],
        });
      
      }); 



      
    }
  });
});
