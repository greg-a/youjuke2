var db = require("../models");
var passport = require("../config/passport")

module.exports = function (app) {
  // Get all examples
  app.get("/api/examples", function (req, res) {
    db.Example.findAll({}).then(function (dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new user
  app.post("/api/signup", function(req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    }).then(function() {
      res.redirect(307, "/api/login");
    }).catch(function(err){
      res.status(401).json(err);
      console.log(err)
    })
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function (req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function (dbExample) {
      res.json(dbExample);
    });
  });

  app.post("/api/songs", function (req, res) {
    console.log("New Song:");
    console.log(req.body);
    db.Song.create({
      deezerID: req.body.deezerID,
      artistName: req.body.artistName,
      songName: req.body.songName,
      songURL: req.body.SongURL,
      thumbnail: req.body.thumbnail,
      upvote: 0
    }).then(function (results) {
      res.json(results);
    });
  });
};
