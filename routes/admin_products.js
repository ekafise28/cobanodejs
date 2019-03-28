var express = require("express");
var router = express.Router();
var mkdirp = require("mkdirp");
var fs = require("fs-extra");
var resizeImg = require("resize-img");
var auth = require("../config/auth");
var isAdmin = auth.isAdmin;
var Product = require("../models/product");
var Category = require("../models/category");
var Kota_kab = require('../models/kota_kab');
var Province = require('../models/province');


// Get pages index
router.get("/", isAdmin, function(req, res) {
  var count;

  Product.count(function(err, c) {
    count = c;
  });

  Product.find(function(err, products) {
    res.render("admin/products", {
      products: products,
      count: count
    });
  });
});

// contoh
router.get("/kotakabJson",isAdmin,function(req,res){
Kota_kab.find().lean().exec(function (err, users) {
  return res.end(JSON.stringify(users));
});
})

// Membuat add product dengan method GET
router.get("/add-product", isAdmin, function(req, res) {
  var id_adv = "";
  var category = "";
  var title = "";
  var slug = "";
  var desc = "";
  var price = "";
  var discount = "";
  var negotiable = "";
  var uploaddate = "";
  var sellername = "";
  var galery = "";
  var phone = "";
  var address = "";
  var kota_kab = "";
  var province = "";
  var image = "";
  var image1 = "";
  var image2 = "";
  var image3 = "";
  var image4 = "";
  var totalviewmber = "";
  var activeflag = "";

  var sms = ""; 
  var wa = ""; 
  var media = "";
  var tahun = "";
  var ukuran = "";
  var seniman = "";


  Province.find(function(err, provinces){
    Category.find(function(err, categories){
      res.render("admin/add_product", {
        title: title,
        id_adv: id_adv,
        categories: categories,
        title: title,
        slug: slug,
        desc: desc,
        price: price,
        discount: discount, 
        negotiable: negotiable , 
        uploaddate: uploaddate,
        sellername: sellername,
        galery: galery,
        phone: phone,
        address: address ,
        kota_kab: kota_kab ,
        provinces: provinces,
        image: image,
        image1: image1,
        image2: image2 ,
        image3: image3 ,
        image4: image4 ,
        totalviewmber: totalviewmber,
        activeflag: activeflag,

         sms: sms,
         wa: wa,
         media: media,
         tahun: tahun,
         ukuran: ukuran,
         seniman: seniman,
      });
    })
  });

});


// Membuat method POST pada add product
router.post("/add-product", function(req, res) {
  var imageFile =
    typeof req.files.image !== "undefined" ? req.files.image.name : "";

  req.checkBody("title", "Title must have a value.").notEmpty();
  req.checkBody("desc", "Description must have a value.").notEmpty();
  req.checkBody("price", "Price must have a value.").isDecimal();
  req.checkBody("image", "You must upload an image").isImage(imageFile);

  var title = req.body.title;
  var slug = title.replace(/\s+/g, "-").toLowerCase();
  var desc = req.body.desc;
  var price = req.body.price;
  var category = req.body.category;

  var id_adv = req.body.id_adv;
  var discount = req.body.discount;
  var negotiable = req.body.negotiable;
  //var uploaddate = req.body.uploaddate;
  var sellername = req.body.sellername;
  var galery = req.body.galery;
  var phone = req.body.phone
  var address = req.body.address;
  var kota_kab = req.body.kota_kab;
  var province = req.body.province;
  var totalviewmber = req.body.totalviewmber;
  var activeflag = req.body.activeflag;
  var sms = req.body.sms;
  var wa = req.body.wa;
  var media = req.body.media;
  var tahun = req.body.tahun;
  var ukuran = req.body.ukuran;
  var seniman = req.body.seniman;

  var errors = req.validationErrors();
  
  console.log(errors);
  
  if (errors) {
    Category.find(function(err, categories) {
      res.render("admin/add_product", {
        errors: errors,
        title: title,
        id_adv: id_adv,
        category: category,
        title: title,
        slug: slug,
        desc: desc,
        price: price,
        discount: discount, 
        negotiable: negotiable , 
        //uploaddate: uploaddate,
        sellername: sellername,
        galery: galery,
        phone: phone,
        address: address ,
        kota_kab: kota_kab ,
        province: province,
        image: imageFile,
        // image1: image1,
        // image2: image2 ,
        // image3: image3 ,
        // image4: image4 ,
        totalviewmber: totalviewmber,
        activeflag: activeflag,

        sms: sms,
        wa: wa,
        media: media,
        tahun: tahun,
        ukuran: ukuran,
        seniman: seniman,
      });
    });
  } else {
    Product.findOne({ slug: slug }, function(err, product) {
      if (product) {
        req.flash("danger", "Product title exists, choose another.");
        Category.find(function(err, categories) {
          res.render("admin/add_product", {
            title: title,
            id_adv: id_adv,
            category: category,
            title: title,
            slug: slug,
            desc: desc,
            price: price,
            discount: discount, 
            negotiable: negotiable , 
            //uploaddate: uploaddate,
            sellername: sellername,
            galery: galery,
            phone: phone,
            address: address ,
            kota_kab: kota_kab ,
            province: province,
            totalviewmber: totalviewmber,
            activeflag: activeflag,

            sms: sms,
            wa: wa,
            media: media,
            tahun: tahun,
            ukuran: ukuran,
            seniman: seniman,
          });
        });
      } else {
        var price2 = parseFloat(price).toFixed(2);

        var product = new Product({
          title: title,
          id_adv: id_adv,
          category: category,
          title: title,
          slug: slug,
          desc: desc,
          price: price,
          discount: discount, 
          negotiable: negotiable , 
          //uploaddate: uploaddate,
          sellername: sellername,
          galery: galery,
          phone: phone,
          address: address ,
          kota_kab: kota_kab ,
          province: province,
          totalviewmber: totalviewmber,
          activeflag: activeflag,
          image: imageFile,

          sms: sms,
          wa: wa,
          media: media,
          tahun: tahun,
          ukuran: ukuran,
          seniman: seniman,
        });

        product.save(function(err) {
          if (err) return console.log(err);

          mkdirp("public/product_images/" + product._id, function(err) {
            return console.log(err);
          });

          mkdirp("public/product_images/" + product._id + "/gallery", function(
            err
          ) {
            return console.log(err);
          });

          mkdirp(
            "public/product_images/" + product._id + "/gallery/thumbs",
            function(err) {
              return console.log(err);
            }
          );

          if (imageFile != "") {
            var productImage = req.files.image;
            var path = "public/product_images/" + product._id + "/" + imageFile;

            productImage.mv(path, function(err) {
              return console.log(err);
            });
          }

          req.flash("success", "Product added!");
          res.redirect("/admin/products");
        });
      }
    });
  }
});

// GET edit product
router.get("/edit-product/:id", isAdmin, function(req, res) {
  var errors;

  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null;

  Category.find(function(err, categories) {
    Product.findById(req.params.id, function(err, pro) {
      if (err) {
        console.log(err);
        res.redirect("/admin/products");
      } else {
        var galleryDir = "public/product_images/" + pro._id + "/gallery";
        var galleryImages = null;

        fs.readdir(galleryDir, function(err, files) {
          if (err) {
            console.log(err);
          } else {
            galleryImages = files;

            res.render("admin/edit_product", {
              title: pro.title,
              errors: errors,
              desc: pro.desc,
              categories: categories,
              category: pro.category.replace(/\s+/g, "-").toLowerCase(),
              price: parseFloat(pro.price).toFixed(2),
              image: pro.image,
              galleryImages: galleryImages,
              id: pro._id,
              discount: pro.discount,
            
              negotiable: pro.negotiable,
              //uploaddate: pro.uploaddate,
              sellername: pro.sellername,
              galery: pro.galery,
              phone: pro.phone,
              address: pro.address,
              kota_kab: pro.kota_kab,
              province: pro.province,
              totalviewer: pro.totalviewer,
              activeflag: pro.activeflag, 

              sms: pro.sms,
              wa: pro.wa,
              media: pro.media,
              tahun: pro.tahun,
              ukuran: pro.ukuran,
              seniman: pro.seniman,
            });
          }
        });
      }
    });
  });
});

// Membuat method POST pada edit product
router.post("/edit-product/:id", function(req, res) {
  var imageFile =
    typeof req.files.image !== "undefined" ? req.files.image.name : "";

  req.checkBody("title", "Title must have a value.").notEmpty();
  req.checkBody("desc", "Description must have a value.").notEmpty();
  req.checkBody("price", "Price must have a value.").isDecimal();
  req.checkBody("image", "You must upload an image").isImage(imageFile);

   
  // discount: 
  // negotiable: 
  // sellername: 
  // galery: 
  // phone: 
  // address:
  // sms: 
  // wa:
  // media: 
  // tahun: 
  // ukuran: 
  // seniman: 

  var title = req.body.title;
  var slug = title.replace(/\s+/g, "-").toLowerCase();
  var desc = req.body.desc;
  var price = req.body.price;
  var category = req.body.category;
  var pimage = req.body.pimage;
  var id = req.params.id;
  var errors = req.validationErrors();

  var discount = req.body.discount; 
  var negotiable = req.body.negotiable;
  var sellername = req.body.sellername;
  var galery = req.body.galery;
  var phone = req.body.phone;
  var address = req.body.address;
  var sms = req.body.sms;
  var wa = req.body.wa;
  var media = req.body.media;
  var tahun = req.body.tahun;
  var ukuran = req.body.ukuran;
  var seniman = req.body.seniman;

  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin/products/edit-product/" + id);
  } else {
    Product.findOne({ slug: slug, _id: { $ne: id } }, function(err, p) {
      if (err) console.log(err);

      if (p) {
        req.flash("danger", "Product title exists, choose another.");
        res.redirect("/admin/products/edit-product/" + id);
      } else {
        Product.findById(id, function(err, p) {
          if (err) console.log(err);

          p.title = title;
          p.slug = slug;
          p.desc = desc;
          p.price = parseFloat(price).toFixed(2);
          p.category = category;

          p.discount = discount; 
          p.negotiable = negotiable;
          p.sellername = sellername;
          p.galery = galery;
          p.phone = phone;
          p.address = address;
          p.sms = sms;
          p.wa = wa;
          p.media = media;
          p.tahun = tahun;
          p.ukuran = ukuran;

          if (imageFile != "") {
            p.image = imageFile;
          }

          p.save(function(err) {
            if (err) console.log(err);

            if (imageFile != "") {
              if (pimage != "") {
                fs.remove(
                  "public/product_images/" + id + "/" + pimage,
                  function(err) {
                    if (err) console.log(err);
                  }
                );
              }

              var productImage = req.files.image;
              var path = "public/product_images/" + id + "/" + imageFile;

              productImage.mv(path, function(err) {
                return console.log(err);
              });
            }

            req.flash("success", "Product edited!");
            res.redirect("/admin/products/edit-product/" + id);
          });
        });
      }
    });
  }
});

// POST product gallery
router.post("/product-gallery/:id", function(req, res) {
  var productImage = req.files.file;
  var id = req.params.id;
  var path = "public/product_images/" + id + "/gallery/" + req.files.file.name;
  var thumbsPath =
    "public/product_images/" + id + "/gallery/thumbs/" + req.files.file.name;

  productImage.mv(path, function(err) {
    if (err) console.log(err);

    resizeImg(fs.readFileSync(path), { width: 100, height: 100 }).then(function(
      buf
    ) {
      fs.writeFileSync(thumbsPath, buf);
    });
  });

  res.sendStatus(200);
});

// GET delete image
router.get("/delete-image/:image", isAdmin, function(req, res) {
  var originalImage =
    "public/product_images/" + req.query.id + "/gallery/" + req.params.image;
  var thumbImage =
    "public/product_images/" +
    req.query.id +
    "/gallery/thumbs/" +
    req.params.image;

  fs.remove(originalImage, function(err) {
    if (err) {
      console.log(err);
    } else {
      fs.remove(thumbImage, function(err) {
        if (err) {
          console.log(err);
        } else {
          req.flash("success", "Image deleted!");
          res.redirect("/admin/products/edit-product/" + req.query.id);
        }
      });
    }
  });
});

// GET delete product
/*
 * GET delete product
 */
router.get("/delete-product/:id", isAdmin, function(req, res) {
  var id = req.params.id;
  var path = "public/product_images/" + id;

  fs.remove(path, function(err) {
    if (err) {
      console.log(err);
    } else {
      Product.findByIdAndRemove(id, function(err) {
        console.log(err);
      });

      req.flash("success", "Product deleted!");
      res.redirect("/admin/products");
    }
  });
});

// export
module.exports = router;
