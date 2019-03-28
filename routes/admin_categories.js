var express = require("express");
var router = express.Router();
var auth = require("../config/auth");
var isAdmin = auth.isAdmin;
var mkdirp = require("mkdirp");
var fs = require("fs-extra");
var resizeImg = require("resize-img");
var multipart = require('connect-multiparty');

// Get Category model.
var Category = require("../models/category");

// Get Category index
router.get("/", isAdmin, function(req, res) {
  //mengambil data dari database
  Category.find(function(err, categories) {
    if (err) return console.log(err);
    res.render("admin/categories", {
      categories: categories
    });
  });
});

// Membuat add category dengan method GET
router.get("/add-category", isAdmin, function(req, res) {
  var judul = "";
  var title = "";
  var slug = "";
  var activeflag = "";
  var image = "";

  res.render("admin/add_category", {
    judul: judul,
    title: title,  
    slug: slug,
    activeflag: activeflag,
    image: image
  });
});

// Membuat method POST pada add category
router.post("/add-category", function(req, res) {

  var imageFile =
    typeof req.files.image !== "undefined" ? 
    req.files.image.name: "";

  console.log(req.files.image.name); 

  req.checkBody("judul", "Judul must have a value.").notEmpty();
  req.checkBody("title", "Title must have a value.").notEmpty();
  req.checkBody("image", "You must upload an image").isImage(imageFile);

  var judul = req.body.judul;
  var title = req.body.title;
  var slug = title.replace(/\s+/g, "-").toLowerCase();
  var activeflag = req.body.activeflag;
  var errors = req.validationErrors();

  if (errors) {
    res.render("admin/add_category", {
      errors: errors,
      judul: judul,
      title: title,
      activeflag: activeflag,
      image: imageFile
    });
  } else {
    Category.findOne({ slug: slug }, function(err, category) {
      if (category) {
        req.flash("danger", "Category title exists, choose another.");
        res.render("admin/add_category", {
          judul: judul,
          title: title,
          activeflag: activeflag,
          image: image
        });
      } else {
        var category = new Category({
          judul: judul,
          title: title,
          slug: slug,
          activeflag: activeflag, 
          image: imageFile
        });

        category.save(function(err) {
          if (err) return console.log(err);

          mkdirp("public/cat_images/" + category._id, function(err) {
            return console.log(err);
          });

          mkdirp("public/cat_images/" + category._id + "/gallery", function(
            err
          ) {
            return console.log(err);
          });

          mkdirp(
            "public/cat_images/" + category._id + "/gallery/thumbs",
            function(err) {
              return console.log(err);
            }
          );


          if (imageFile != "") {
            var catImage = req.files.image;
            var path = "public/cat_images/" + category._id + "/" + imageFile;

            catImage.mv(path, function(err) {
              return console.log(err);
            });
          }


          Category.find(function(err, categories) {
            if (err) {
              console.log(err);
            } else {
              req.app.locals.categories = categories;
            }
          });

          req.flash("success", "Category has added!");
          res.redirect("/admin/categories");
        });
      }
    });
  }
});

// GET edit Category
router.get("/edit-category/:id", isAdmin, function(req, res) {
  Category.findById(req.params.id, function(err, category) {
    if (err) {
      console.log(err);
      res.redirect("/admin/categories");
    } else {
      var galleryDir = "public/cat_images/" + category._id + "/gallery";
      var galleryImages = null;

      fs.readdir(galleryDir, function(err, files) {
        if (err) {
          console.log(err);
        } else {
          galleryImages = files;

    res.render("admin/edit_category", {
      judul: category.judul,
      title: category.title,
      id: category._id,
      image: category.image,
      activeflag: category.activeflag,
      id: category.id,
      });
    }
  });
  }
});
});
    

// Membuat method POST pada edit category
router.post("/edit-category/:id", multipart(), function(req, res) {
  var imageFile =
  typeof req.files.image !== "undefined" ? req.files.image.name : "";

  req.checkBody("judul", "Judul must have a value").notEmpty();
  req.checkBody("title", "Title must have a value").notEmpty();
 // req.checkBody("image", "You must upload an image").isImage(imageFile);
  var judul = req.body.judul;
  var title = req.body.title;
  var slug = title.replace(/\s+/g, "-").toLowerCase();
  var id = req.params.id;
  var activeflag = req.body.activeflag;
  var pimage = req.body.pimage;

  var errors = req.validationErrors(); 

  if (errors) {
    res.render("admin/edit_category/" + id, {
      errors: errors,
      judul: judul,
      title: title,
      id: id,
      activeflag: activeflag
    });
  } else {
    Category.findOne({ slug: slug, _id: { $ne: id } }, function(err, category) {
      if (category) {
        req.flash("danger", "Category title is exist, choose another title");
        res.render("admin/edit_category/" + id, {
          judul: judul,
          title: title,
          id: id,
          activeflag: activeflag
        });
      } else {
        Category.findById(id, function(err, category) {
          if (err) return console.log(err);
          category.judul = judul;
          category.title = title;
          category.slug = slug;
          category.activeflag = activeflag;
          if (imageFile != "") {
            category.image = imageFile;
          }
         
          category.save(function(err) {
            if (err) return console.log(err);

            // Category.find(function(err, categories) {
            //   if (err) {
            //     console.log(err);
            //   } else {
            //     req.app.locals.categories = categories;
            //   }
            // });

            console.log('imagefile:' + imageFile);
            console.log('image:' +pimage);
            if (imageFile != "") {
              if (pimage != "") {
                fs.remove("public/cat_images/" + id + "/" + pimage,
            
                  function(err) {
                    if (err) console.log(err);
                  }
                );
              }

              var catImage = req.files.image;
              var path = "public/cat_images/" + id + "/" + imageFile;

              catImage.mv(path, function(err) {
                return console.log(err);
              });
            }

            req.flash("success", "Category edited!");
            res.redirect("/admin/categories/edit-category/" + id);
          });
        });
      }
    });
  }
});

// GET delete Category
router.get("/delete-category/:id", isAdmin, function(req, res) {
  Category.findByIdAndRemove(req.params.id, function(err) {
    if (err) return console.log(err);

    Category.find(function(err, categories) {
      if (err) {
        console.log(err);
      } else {
        req.app.locals.categories = categories;
      }
    });

    req.flash("success", "Category deleted!");
    res.redirect("/admin/categories/");
  });
});

// export
module.exports = router;
 