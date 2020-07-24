var db = require("../models");

module.exports = function (app) {
  // Get all examples
  app.get("/api/examples", function (req, res) {
    db.Example.findAll({}).then(function (dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new example
  app.post("/api/examples", function (req, res) {
    db.Example.create(req.body).then(function (dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function (req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function (dbExample) {
      res.json(dbExample);
    });
  });

  app.get("/api/songs", function (req, res) {
    db.song.findAll({}).then(function (results) {//consider changing this variable to Song
      res.json(results);
    });
  });

  app.post("/api/songs", function (req, res) {
    console.log("New Song:");
    console.log(req.body);
    db.song.create({//consider changing this variable to Song instead of song
      deezerID: req.body.deezerID,
      artistName: req.body.artistName,
      songName: req.body.songName,
      songURL: req.body.songURL,
      thumbnail: req.body.thumbnail,
      upvote: 0
    }).then(function (results) {
      res.json(results);
    });
  });
};
