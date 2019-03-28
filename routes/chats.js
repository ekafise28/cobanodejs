var express = require("express");
var router = express.Router();
var fs = require("fs-extra");
var auth = require("../config/auth");
var isUser = auth.isUser;
var Chat = require("../models/chat");
var User = require("../models/user");


// GET all chats
router.get("/:email", function(req, res) {
  // var count;
  // chats.count(function(err, c) {
  //   count = c;
  // });
  var email = req.params.email;
  Chat.find({ emailsender: email },function(err, chats) {
    if (err) console.log(err); 
    res.render("admin/chats", {
      chats: chats
    });
  }); 
});

// GET products by category
router.get("/:category", function(req, res) {
  var categorySlug = req.params.category;

  Category.findOne({ slug: categorySlug }, function(err, c) {
    Product.find({ category: categorySlug }, function(err, products) {
      if (err) console.log(err);
      res.render("cat_products", {
        title: c.title,
        products: products
      });
    });
  });
});

// //GET product details
// router.get("/:category/:product", function(req, res) {
//   var galleryImages = null;
//   var loggedIn = req.isAuthenticated() ? true : false;

//   Product.findOne({ slug: req.params.product }, function(err, product) {
//     if (err) {
//       console.log(err);
//     } else {
//       var galleryDir = "public/product_images/" + product._id + "/gallery"; 

//       fs.readdir(galleryDir, function(err, files) {
//         if (err) {
//           console.log(err);
//         } else {
//            galleryImages = files;
//            res.render("product", {
//             title: product.title,
//             p: product,
//             galleryImages: galleryImages,
//             loggedIn: loggedIn
//           });
//         }
//       });
//     }
//   });
// });

// router.get('/products/:page', function(req, res, next) {
//   var perPage = 9
//   var page = req.params.page || 1
//   Product
//       .find({})
//       .skip((perPage * page) - perPage)
//       .limit(perPage)
//       .exec(function(err, products) {
//           Product.count().exec(function(err, count) {
//               if (err) return next(err)
//               res.render('main/products', {
//                   products: products,
//                   current: page,
//                   pages: Math.ceil(count / perPage)
//               })
//           })
//       })
// })
// Exports
module.exports = router;
