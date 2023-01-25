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
  content: String,
});

const Article = new mongoose.model("article", articleSchema);

// ////////////////////////// REQ ALL ARTICLES
app
  //  If u need multiple routes like post/get/delete for 1 item.
  .route("/articles")
  // Get route
  .get((req, res) => {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        console.log(err);
      }
    });
  })

  // Post route
  .post((req, res) => {
    // IMPORTANT send x-www-form-urlencoded
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save((err) => {
      if (!err) {
        res.send("succesfully added new article");
      } else {
        res.send(err);
      }
    });
  })

  // Delete
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send("deleted articles!");
      } else {
        res.send(err);
      }
    });
  });

// //////////////////////// Specifieke route
app
  .route("/articles/:articleTitle")

  .get((req, res) => {
    // Space is %20
    Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles found!");
      }
    });
  })

  // UPDATING specifick, by updatemany
  .put((req, res) => {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      (err) => {
        if (!err) {
          res.send("succesfully updated");
        }
      }
    );
  });

// Let app listen to port.
app.listen(3000, () => {
  console.log(`Example app listening on port 3000`);
});
