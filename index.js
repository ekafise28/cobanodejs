const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const expressValidator = require("express-validator");
const fileUpload = require("express-fileupload");
const passport = require("passport");
const cookieParser = require('cookie-parser'); 


// express()
//   .use(express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'views'))
//   .set('view engine', 'ejs')
//   .get('/', (req, res) => res.render('index'))
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`))

  
const mongoDB = "mongodb://heroku_login123:Ayam!123@ds123196.mlab.com:23196/heroku_qgkt37l7";
mongoose.connect(mongoDB, {
  useNewUrlParser: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// Initial 
const app = express();
// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// Set public folder
app.use(express.static(path.join(__dirname, "public")));
// Setup Global errors variable
app.locals.errors = null;

// Get Page Model
const Page = require("./models/page");

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
const Category = require("./models/category");

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
      const namespace = param.split("."),
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
        const extension = path.extname(filename).toLowerCase();
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
const pages = require("./routes/pages.js");
const products = require("./routes/products.js");
const cart = require("./routes/cart.js");
const users = require("./routes/users.js");
const adminPages = require("./routes/admin_pages.js");
const adminCategories = require("./routes/admin_categories.js");
const adminProducts = require("./routes/admin_products.js");
const adminProvinces = require("./routes/admin_provinces.js");
const searchs = require("./routes/search.js");
const adminaccounts = require("./routes/accounts.js");
const adminchats = require("./routes/chats.js");
 
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

app.listen(PORT, function() {
  console.log("Server running on port " + PORT);
});