var db = require("../models");
var passport = require("../config/passport")

module.exports = function (app) {
  // Get all examples
  app.get("/api/examples", function (req, res) {
    db.Example.findAll({}).then(function (dbExamples) {
      res.json(dbExamples);
    });
  });

  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    res.json(req.user);
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

  //need to figure out how to redirect user to new room immediately after posting
  app.post("/api/room", function(req, res) {
    db.room.create({
      name: req.body.name,
      description: req.body.description
    }).then(function(results){
      var newPage = "/room/" + results.dataValues.id;
      res.send({redirect: newPage})
      console.log(req.body.name + " was added.")
    })
  })

  // Delete an example by id
  app.delete("/api/examples/:id", function (req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function (dbExample) {
      res.json(dbExample);
    });
  });

  app.get("/api/songs/?:roomId", function (req, res) {
    db.song.findAll({ where : { roomId: req.params.roomId }, order: [["upvote", "DESC"], ["id", "ASC"]]}).then(function (songs) {//consider changing this variable to Song
      res.json(songs);
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
      roomId: req.body.roomID, 
      upvote: 0
    }).then(function (results) {
      res.json(results);
      console.log(results)
    });
  });
};
