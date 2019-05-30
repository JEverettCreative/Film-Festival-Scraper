var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");

// Require models
var db = require("./models");

var PORT = 3000;

var app = express();

var router = express.Router();
require("./config/routes")(router);
// Configure middleware


app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(router);

// Connect to Mongo
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/festivals";

mongoose.connect(MONGODB_URI);


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
