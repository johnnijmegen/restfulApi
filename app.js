const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

// Setup ejs
app.set("view engine", ejs);

mongoose.set("strictQuery", false);
// setup static files
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {
  useNewUrlParser: true,
});

// Setting up the model and schema.

const articleSchema = new mongoose.Schema({
  title: String,
  constent: String,
});

const Article = new mongoose.model("article", articleSchema);

// Create the GET routes.
app.get("/articles", (req, res) => {
  Article.find(function (err, foundArticles) {
    if (!err) {
      res.send(foundArticles);
    } else {
      console.log(err);
    }
  });
});

// Let app listen to port.
app.listen(3000, () => {
  console.log(`Example app listening on port 3000`);
});
