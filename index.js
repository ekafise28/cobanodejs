const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const mongoose = require("mongoose");

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
