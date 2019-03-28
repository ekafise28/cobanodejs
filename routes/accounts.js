var express = require("express");
var router = express.Router();
var mkdirp = require("mkdirp");
var fs = require("fs-extra");
var resizeImg = require("resize-img");
var auth = require("../config/auth");
var isAdmin = auth.isAdmin;
var Account = require("../models/user");

// Get pages index
router.get("/:id", isAdmin, function(req, res) {
    var idaccount = req.params.id;
    Account.findOne({ _id: idaccount }, function(err, accounts) {
      if (err) console.log(err); 
      res.render("admin/accounts", {
        title: "Data Akun",
        accounts: accounts,
      });
    }); 
  });// export

// GET edit product
router.get("/edit-account/:id", isAdmin, function(req, res) {
  var errors;
  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null;

    Account.findById(req.params.id, function(err, accc) {
      if (err) {
        console.log(err);
        res.redirect("/admin/accounts");
      } else {
            //var galleryDir = "public/product_images/" + pro._id + "/gallery";
            //var galleryImages = null;

              if (err) {
                console.log(err);
              } else {
                //galleryImages = files;
                res.render("admin/edit_account", {
                  id: accc._id,
                  id_account: accc.id_account,
                  name: accc.negotiable,
                  email: accc.email,
                  address: accc.address,
                  province: accc.province,
                  kota_kab: accc.kota_kab,
                  facebook: accc.facebook,
                  instagram: accc.instagram,
                  image: accc.image, 
                  activeflag: accc.activeflag, 
            });
          }
      
      }
    });
});

// Membuat method POST pada edit product
router.post("/edit-account/:id", function(req, res) {
  var imageFile =
    typeof req.files.image !== "undefined" ? req.files.image.name : "";

  req.checkBody("email", "Email must have a value.").notEmpty();
  //req.checkBody("image", "You must upload an image").isImage(imageFile);

  var name = req.body.name;
  var phone = req.body.phone;
  var email = req.body.email;
  var address = req.body.address;
  var province = req.body.province;
  var kota_kab = req.body.kota_kab;
  var id = req.params.id;
  var errors = req.validationErrors();
  var facebook = req.body.facebook; 
  var instagram = req.body.instagram;
  
  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin/accounts/edit-account/" + id);
  } else {
    Account.findOne({ email: email, _id: { $ne: id } }, function(err, p) {
      if (err) console.log(err);

        Account.findById(id, function(err, p) {
          if (err) console.log(err);

          p.name = name;
          p.phone = phone;
          p.address = address;
          p.province = province;
          p.kota_kab = kota_kab; 
          p.facebook = facebook;
          p.instagram = instagram;
          if (imageFile != "") {
            p.image = imageFile;
          }

          p.save(function(err) {
            if (err) console.log(err);
            
            if (imageFile != "") {
              if (pimage != "") {
                fs.remove(
                  "public/account_images/" + id + "/" + pimage,
                  function(err) {
                    if (err) console.log(err);
                  }
                );
              }

              var productImage = req.files.image;
              var path = "public/account_images/" + id + "/" + imageFile;

              productImage.mv(path, function(err) {
                return console.log(err);
              });
            }
            req.flash("success", "Akun edited!");
            res.redirect("/admin/accounts/edit-account/" + id);
          });
        });
    });
  }
});

module.exports = router;
 
 