var express = require("express");
var router = express.Router();
var auth = require("../config/auth");
var isAdmin = auth.isAdmin;

// Get Province model.
var Province = require("../models/province");

// Get pages index
router.get("/", isAdmin, function(req, res) {
  // mengambil data dari database
  Province.find({})
    .sort({ sorting: 1 })
    .exec(function(err, provinces) {
      res.render("admin/provinces", {
        provinces: provinces
      });
    });
});

// Membuat add page dengan method GET
router.get("/add-province", isAdmin, function(req, res) {
  var title = "";
  var slug = "";
  var activeflag = "";

  res.render("admin/add_province", {
    title: title,
    slug: slug,
    activeflag: activeflag
  });
});


// Membuat method POST pada add page
router.post("/add-province", function(req, res) {
  req.checkBody("title", "Province title must have a value").notEmpty();
  
  var title = req.body.title;
  var slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
  if (slug == "") slug = title.replace(/\s+/g, "-").toLowerCase();
  var activeflag = req.body.activeflag;
  var errors = req.validationErrors();

  if (errors) {
    res.render("admin/add_province", {
      errors: errors,
      title: title,
      slug: slug,
      activeflag: activeflag
    });
  } else {
    Province.findOne({ slug: slug }, function(err, page) {
      if (province) {
        req.flash("danger", "Province slug is exist, choose another slug");
        res.render("admin/add_province", {
            title: title,
            slug: slug,
            activeflag: activeflag
        });
      } else {
        var province = new Province({
            title: title,
            slug: slug,
            activeflag: activeflag,
            sorting: 100
        });

        province.save(function(err) {
          if (err) return console.log(err);

          // add here
          Province.find({})
            .sort({ sorting: 1 })
            .exec(function(err, provinces) {
              if (err) {
                console.log(err);
              } else {
                req.app.locals.provinces = provinces;
              }
            });

          req.flash("success", "Province added!");
          res.redirect("/admin/provinces");
        });
      }
    });
  }
});

// Sort pages function
function sortProvinces(ids, callback) {
  var count = 0;

  for (var i = 0; i < ids.length; i++) {
    var id = ids[i];
    count++;

    (function(count) {
      Province.findById(id, function(err, province) {
        province.sorting = count;
        province.save(function(err) {
          if (err) return console.log(err);
          ++count;
          if (count >= ids.length) {
            callback();
          }
        });
      });
    })(count);
  }
}

// Membuat POST sortable provinces
router.post("/reorder-provinces", function(req, res) {
  // console.log(req.body);

  var ids = req.body["id[]"];

  sortProvinces(ids, function() {
    Province.find({})
      .sort({ sorting: 1 })
      .exec(function(err, provinces) {
        if (err) {
          console.log(err);
        } else {
          req.app.locals.provinces = provinces;
        }
      });
  });
});

// GET edit page
router.get("/edit-province/:slug", isAdmin, function(req, res) {
  Province.findOne({ slug: req.params.slug }, function(err, province) {
    if (err) return console.log(err);

    res.render("admin/edit_province", {
      title: province.title,
      slug: province.slug,
      activeflag: province.content,
      id: province._id
    });
  });
});

// Membuat method POST pada edit page
router.post("/edit-province/:slug", function(req, res) {
  req.checkBody("title", "Province title must have a value").notEmpty();

  var title = req.body.title;
  var slug = title.replace(/\s+/g, "-").toLowerCase();
  var id = req.params.id;
  var activeflag = req.body.activeflag;

  var errors = req.validationErrors();

  if (errors) {
    res.render("admin/edit_province", {
      errors: errors,
      title: title,
      id: id,
      activeflag: activeflag
    });
  } else {
    Province.findOne({ slug: slug, _id: { $ne: id } }, function(err, province) {
      if (province) {
        req.flash("danger", "Province title is exist, choose another title");
        res.render("admin/edit_province", {
          title: title,
          id: id,
          activeflag: activeflag
        });
      } else {
        Province.findById(id, function(err, province) {
          if (err) return console.log(err);
          province.title = title;
        
          province.slug = slug;
          province.activeflag = activeflag;

          province.save(function(err) {
            if (err) return console.log(err);

            Province.find(function(err, provinces) {
              if (err) {
                console.log(err);
              } else {
                req.app.locals.provinces = provinces;
              }
            });

            req.flash("success", "Provinces has been Edited!");
            res.redirect("/admin/province/edit-provinces/" + id);
          });
        });
      }
    });
  }
});

// GET delete page
router.get("/delete-province/:id", isAdmin, function(req, res) {
  Province.findByIdAndRemove(req.params.id, function(err) {
    if (err) return console.log(err);

    // add here
    Province.find(function(err, provinces) {
        if (err) {
          console.log(err);
        } else {
          req.app.locals.provinces = provinces;
        }
      });
  
      req.flash("success", "Province deleted!");
      res.redirect("/admin/provinces/");
    });
  });
  

// export
module.exports = router;
