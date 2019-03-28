"use strict";

var express = require("express");
var router = express.Router();
var passport = require("passport");
var bcrypt = require("bcryptjs");


// Get Users model
var User = require("../models/user");
var Token = require("../models/token");
var Configure = require("../config/config")

/*
 * GET register
 */
router.get("/register", function(req, res) {
  res.render("register", {
    title: "Register"
  });
});

/*
 * POST register
 */
router.post("/register", function(req, res) {
  //var name = req.body.name;
  //var email = req.body.email;
  //var username = req.body.username;
  var password = req.body.password;
  //var password2 = req.body.password2;
  var temppass = "";

  req.checkBody("name", "Name is required!").notEmpty();
  req.checkBody("email", "Email is required!").isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty(); //e
  //req.checkBody("username", "Username is required!").notEmpty();
  req.checkBody("password", "Password is required!").notEmpty();
  req.assert('password', 'Password cannot be blank').notEmpty();//e
  //req.sanitize('email').normalizeEmail({ remove_dots: false });//e
  req.checkBody("password2", "Passwords do not match!").equals(password);

  var errors = req.validationErrors();

  if (errors) {
    res.render("register", {
      errors: errors,
      user: null,
      title: "Register"
    });
  } else {
   
  // Check for validation errors    
  var errors = req.validationErrors();
  if (errors) { return res.status(400).send(errors); }

  // Make sure this account doesn't already exist
  User.findOne({ email: req.body.email }, function (err, user) {

    // Make sure user doesn't already exist
    if (user){
      req.flash("danger", 'The email address you have entered is already associated with another account ' + user.email + '.');
      res.redirect("/users/login");
    }

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        if (err) console.log(err);
        temppass = hash;
       
        user = new User({ name: req.body.name, email: req.body.email, password: temppass });
        user.save(function (err) {
            if (err) { return res.status(500).send({ msg: 'error user ' + err.message }); }
    
            // Create a verification token for this user
            var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
            // Save the verification token
            token.save(function (err) {
                if (err) { return res.status(500).send({ msg: 'error token' + err.message }); }
                // Send the email
                // var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
                // var mailOptions = { from: 'no-reply@yourwebapplication.com', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
                // transporter.sendMail(mailOptions, function (err) {
                //     if (err) { return res.status(500).send({ msg: 'error trasporter' + err.message }); }
                //     res.status(200).send('A verification email has been sent to ' + user.email + '.');
                // });
    
                //***** gmail */
                console.log('* [example 1.1] sending test email');
                // Require'ing module and setting default options
                var send = require('gmail-send')({
                //var send = require('../index.js')({
                  user: Configure.email_apps,
                  // user: credentials.user,                  // Your GMail account used to send emails
                  pass: Configure.email_password,
                  // pass: credentials.pass,                  // Application-specific password
                  to:  user.email,
                  // to:   credentials.user,                  // Send to yourself
                                                          // you also may set array of recipients:
                                                          // [ 'user1@gmail.com', 'user2@gmail.com' ]
                  subject: 'send token',
                  text:    'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/users\/confirmation\/' + token.token + '.\n',         // Plain text
                  //html:    '<b>html text</b>'            // HTML
                });
                
                // Override any default option and send email
                console.log('* [example 1.1] sending test email');
                //var filepath = './demo-attachment.txt';  // File to attach
                
                send({ // Overriding default parameters
                  subject: 'attached ',         // Override value set as default
                }, function (err, res) {
                  console.log('* [example 1.1] send() callback returned: err:', err, '; res:', res);
                });
                // Set additional file properties
                console.log('* [example 1.2] sending test email');

                send({ // Overriding default parameters
                  subject: 'attached ',              // Override value set as default
                }, function (err, res) {
                  console.log('* [example 1.2] send() callback returned: err:', err, '; res:', res);
                });
                            //****** end gmail */
    
                if (err) { return res.status(500).send({ msg: 'error trasporter' + err.message }); }
                    //res.status(200).send('A verification email has been sent to ' + user.email + '.');
                    req.flash("success", 'A verification email has been sent to ' + user.email + '.');
                    res.redirect("/users/login");
                    console.log('save done');   
            });
        });

      });
    });
    // Create and save the user

  });
  }
});

/*
 * GET login
 */
router.get("/login", function(req, res) {
  if (res.locals.user) res.redirect("/");
  res.render("login", {
    title: "Log in"
  });
});
 
/*
 * POST login
 */
router.post("/login", function(req, res, next) {
  var emailaccount = req.body.username;
  passport.authenticate("local", {
    successRedirect: "/admin/pages", 
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);

  //res.cookie('username',req.body.username);
  
  // cookie for id 
  // console.log(emailaccount);
  // User.findOne({ email: emailaccount }, function(err, user) {
  //   if (err) console.log(err); 
  //   res.cookie('ssiiffdd12309887zxcvasdf123112313id',user._id);  
  // }); 

  //console.log(req.cookies['ssiiffdd12309887zxcvasdf123112313id']);


});

/*
 * GET logout
 */ 
router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "You are logged out!");
  req.session.destroy();
  res.redirect("/users/login");
});

//**** email confirmation */

var crypto = require('crypto');
var nodemailer = require('nodemailer');

/**
* POST /confirmation
*/
router.get("/confirmation/:tokenid", function(req, res, next){
  // req.assert('email', 'Email is not valid').isEmail();
  // req.assert('email', 'Email cannot be blank').notEmpty();
  // req.assert('token', 'Token cannot be blank').notEmpty();
  // req.sanitize('email').normalizeEmail({ remove_dots: false });

  // Check for validation errors    
  // var errors = req.validationErrors();
  // if (errors) return res.status(400).send(errors);

  // Find a matching token
  Token.findOne({ token: req.params.tokenid }, function (err, token) {
      console.log("ini adalah token " + req.params.tokenid)
      if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });
      console.log('token 1 berhasil');
      // If we found a token, find a matching user
      User.findOne({ _id: token._userId }, function (err, user) {
          if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
          if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });

          // Verify and save the user
          user.isVerified = true;
          user.save(function (err) {
            console.log('token 2 berhasil');
              if (err) { return res.status(500).send({ msg: err.message }); }
              //res.status(200).send("The account has been verified. Please log in.");
              req.flash("success", "The account has been verified. Please log in.");
              res.redirect("/users/login");
          });
      });
  });
}
);

/**
* POST /resend
*/
router.post("/resend", function(req, res, next){
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  // Check for validation errors    
  var errors = req.validationErrors();
  if (errors) return res.status(400).send(errors);

  User.findOne({ email: req.body.email }, function (err, user) {
      if (!user) return res.status(400).send({ msg: 'We were unable to find a user with that email.' });
      if (user.isVerified) return res.status(400).send({ msg: 'This account has already been verified. Please log in.' });

      // Create a verification token, save it, and send email
      var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

      // Save the token
      token.save(function (err) {
          if (err) { return res.status(500).send({ msg: err.message }); }

          // Send the email
          var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
          var mailOptions = { from: 'no-reply@codemoto.io', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
          transporter.sendMail(mailOptions, function (err) {
              if (err) { return res.status(500).send({ msg: err.message }); }
              //res.status(200).send('A verification email has been sent to ' + user.email + '.');
              req.flash("success", "A verification email has been sent to " + user.email + ".");
              res.redirect("/users/login");
          });
      });
  });
});

// Exports
module.exports = router;
