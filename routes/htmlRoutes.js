var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.room.findAll({}).then(function(dbExamples) {
      res.render("index", {
        rooms: dbExamples
      });
    });
  });

  // Load example page and pass in an example by id
  app.get("/example/:id", function(req, res) {
    db.Example.findOne({ where: { id: req.params.id } }).then(function(dbExample) {
      res.render("example", {
        example: dbExample
      });
    });
  });

  // Load page for room showing playlist
  app.get("/room/:id", function(req, res) {
    db.room.findOne({ where: { id: req.params.id } }).then(function(dbExample) {
      // console.log(dbExample);
      res.render("room", {
        room: dbExample.dataValues.name
      });
    });

    //db.songs.findAll({ where: { roomid: req.params.id}}).then(function(dbExample) )

  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
