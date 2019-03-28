const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
var session = require("express-session");
var expressValidator = require("express-validator");
var fileUpload = require("express-fileupload");
var passport = require("passport");
var cookieParser = require('cookie-parser'); 


express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

  
var mongoDB = "mongodb://heroku_login123:Ayam!123@ds123196.mlab.com:23196/heroku_qgkt37l7";

mongoose.connect(mongoDB, {
  useNewUrlParser: true
});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));



// Initial 
var app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Set public folder
app.use(express.static(path.join(__dirname, "public")));

// Setup Global errors variable
app.locals.errors = null;

// Get Page Model
var Page = require("./models/page");

// Get all pages to pass to header.ejs
Page.find({})
  .sort({ sorting: 1 })
  .exec(function(err, pages) {
    if (err) {
      console.log(err);
    } else {
      app.locals.pages = pages;
    }
  });

  // var Product = require("./models/products");

  // // Get all pages to pass to header.ejs
  // Product.find({})
  //   .sort({ sorting: 1 })
  //   .exec(function(err, pages) {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       app.locals.pages = pages;
  //     }
  //   });

// Get Category Model
var Category = require("./models/category");

// Get all categories to pass to header.ejs
Category.find(function(err, categories) {
  if (err) {
    console.log(err);
  } else {
    app.locals.categories = categories;
  }
});

// Express fileUpload middleware
app.use(fileUpload());

// Setup body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Setup express session middleware
app.use(
  session({
    //secret: "keyboard cat",
    secret: "sesesuatuuuu",
    resave: true,
    saveUninitialized: true,
    cookie: {
              expires: 600000
            }
    //cookie: { secure: true }
  })
);

//setup cookie
app.use(cookieParser());

// Setup express validator middleware
app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    },
    customValidators: {
      isImage: function(value, filename) {
        var extension = path.extname(filename).toLowerCase();
        switch (extension) {
          case ".jpg":
            return ".jpg";
          case ".jpeg":
            return ".jpeg";
          case ".png":
            return ".png";
          case "":
            return ".jpg";
          default:
            return false;
        }
      }
    }
  })
);

// Setup express messages middleware
app.use(require("connect-flash")());
app.use(function(req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// Passport Config
require("./config/passport")(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// vid 41 app get star
app.get("*", function(req, res, next) {
  res.locals.cart = req.session.cart;
  res.locals.user = req.user || null;
  next();
});


// set routes
var pages = require("./routes/pages.js");
var products = require("./routes/products.js");
var cart = require("./routes/cart.js");
var users = require("./routes/users.js");
var adminPages = require("./routes/admin_pages.js");
var adminCategories = require("./routes/admin_categories.js");
var adminProducts = require("./routes/admin_products.js");
var adminProvinces = require("./routes/admin_provinces.js");
var searchs = require("./routes/search.js");
var adminaccounts = require("./routes/accounts.js");
var adminchats = require("./routes/chats.js");
 
// setup links
app.use("/admin/pages", adminPages);
app.use("/admin/categories", adminCategories);
app.use("/admin/products", adminProducts);
app.use("/admin/provinces", adminProvinces);
app.use("/admin/accounts", adminaccounts);
app.use("/admin/chats",adminchats)
app.use("/products", products);
app.use("/cart", cart);
app.use("/users", users);
app.use("/search", searchs);
app.use("/", pages);