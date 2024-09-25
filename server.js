// imports
require("dotenv").config();
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");

const session = require('express-session');



// Set the port from environment variable or default to 3000
const port = process.env.PORT || "3000";
const authController = require("./controllers/auth.js")

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});


// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
//! this allow us use the req.body

// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));

// new
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);



//routes
app.get("/", (req, res) => {
  res.render("index.ejs", {
    user: req.session.user,
  });
});


//everthing that beins with /auth will ne handeled by authController 
app.use("/auth", authController)

app.get("/auth/sign-in", (req,res) => {
  res.render("auth/sign-in.ejs")
})

app.get("/vip-lounge", (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party ${req.session.user.username}.`);
  } else {
    res.send("Sorry, you are not allowed.");
  }
});


//app listen at 3000
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
