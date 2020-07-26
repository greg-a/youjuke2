var db = require("../models");
var passport = require("../config/passport");
const { sequelize } = require("../models");

module.exports = function (app) {

  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    res.json(req.user);
  });

  // Create a new user
  app.post("/api/signup", function (req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    }).then(function () {
      res.redirect(307, "/api/login");
    }).catch(function (err) {
      res.status(401).json(err);
      console.log(err)
    })
  });

  //need to figure out how to redirect user to new room immediately after posting
  app.post("/api/room", function (req, res) {
    db.room.create({
      name: req.body.name,
      description: req.body.description
    }).then(function (results) {
      var newPage = "/room/" + results.dataValues.id;
      res.send({ redirect: newPage })
      console.log(req.body.name + " was added.")
    })
  })

  app.get("/api/songs/?:roomId", function (req, res) {
    db.song.findAll({ where: { roomId: req.params.roomId, pending: true }, order: [["tempUpvote", "DESC"], ["updatedAt", "ASC"]] }).then(function (songs) {//consider changing this variable to Song
      res.json(songs);
    });
  });

  app.get("/api/allsongs/?:roomId", function (req, res) {
    db.song.findAll({ where: { roomId: req.params.roomId } }).then(function (songs) {
      res.json(songs);
    });
  });

  app.post("/api/songs", function (req, res) {
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
    });
  });

  app.put("/api/songs/ended/?:songId", function (req, res) {
    console.log("updating song: " + req.params.songId)
    db.song.update({ played: sequelize.literal("played + 1"), pending: false },
      {
        where: { id: req.params.songId }
      }).then(function (results) {
        res.json(results);
      });
  });

  app.put("/api/songs/added/?:songId", function (req, res) {
    console.log("added song: " + req.params.songId)
    db.song.findAll({
      attributes: [[sequelize.fn("max", sequelize.col("id")), 'maxID']],
      raw: true
    }).then(function (tempIndex) {
      console.log("temp index: " + JSON.stringify(tempIndex))
      db.song.update({ pending: true, tempUpvote: 0, tempIndex: tempIndex.maxID },
        {
          where: { id: req.params.songId }
        }).then(function (results) {
          res.json(results);
        });
    })
  });

  app.put("/api/songs/upvote/?:songId", function (req, res) {
    console.log("upvote added for song id: " + req.params.songId)
    db.song.update({ upvote: sequelize.literal("upvote + 1"), tempUpvote: sequelize.literal("tempUpvote + 1") },
      {
        where: { id: req.params.songId }
      }).then(function (results) {
        res.json(results);
      });
  });
};

