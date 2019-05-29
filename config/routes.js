var cheerio = require("cheerio");
var db = require("../models");
var axios = require("axios");

// Routes
module.exports = function(router) {

router.get("/", function(req, res) {
    res.render("index");
});

router.get("/saved", function(req, res) {
    res.render("saved");
});

router.get("/api/scrape", function(req, res) {
    axios.get("https://www.screendaily.com/festivals").then(function(response) {
      var $ = cheerio.load(response.data);
  
      // Grab based on the divs marked class subSleeve
      $("div.subSleeve").each(function(i, element) {
        var result = {};
  
        // Add the text and href
        result.title = $(this)
          .find("a")
          .text()
          .trim();
        result.link = $(this)
          .find("a")
          .attr("href");
        result.summary = $(this)
          .find("p")
          .text()
          .trim();
      
      
      // Create a new Article 
        db.Article.create(result)
          .then(function(dbArticle) {
         // Test view in console
            console.log(dbArticle);
          })
          .catch(function(err) {
            console.log(err);
          });
      });
  
      // Send a message to the client
      res.send("Scrape Complete");
    });
  });
  
  // Route for getting all Articles from the db
  router.get("/api/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

//   API Route to pull all saved articles from DB
    router.get("/api/saved", function(req, res) {
    db.Article.find({ saved: true })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
    });

// Delete an article from Saved in DB
    router.delete("/api/articles/:id", function(req, res) {
        db.Article.findByIdAndUpdate({ _id: req.params.id }, { saved: false })
            .then(function(dbArticle) {
                render.json("Article deleted from Saved.");
            })
            .catch(function(err) {
                res.json(err);
            });
    });

// Update an article to Saved in the DB
    router.post("/api/articles/:id", function(req, res) {
        db.Article.findByIdAndUpdate({ _id: req.params.id }, { saved: true })
            .then(function(dbArticle) {
                render.json("Article deleted from Saved.");
            })
            .catch(function(err) {
                res.json(err);
            });
    });


//   // Route for grabbing a specific Article by id, populate it with it's note
//   app.get("/api/articles/:id", function(req, res) {
//     // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//     db.Article.findOne({ _id: req.params.id })
//       // ..and populate all of the notes associated with it
//       .populate("Note")
//       .then(function(dbArticle) {
//         // If we were able to successfully find an Article with the given id, send it back to the client
//         res.json(dbArticle);
//       })
//       .catch(function(err) {
//         // If an error occurred, send it to the client
//         res.json(err);
//       });
//   });

// //   TEMPLATE TO BUILD OFF FOR UPCOMING ROUTES
//   // Route for saving/updating an Article's associated Note
//   app.post("/articles/:id", function(req, res) {
//     // Create a new note and pass the req.body to the entry
//     db.Note.create(req.body)
//       .then(function(dbNote) {
//         // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
//         // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//         // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//         return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
//       })
//       .then(function(dbArticle) {
//         // If we were able to successfully update an Article, send it back to the client
//         res.json(dbArticle);
//       })
//       .catch(function(err) {
//         // If an error occurred, send it to the client
//         res.json(err);
//       });
//   });
  
}