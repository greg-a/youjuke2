var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.room.findAll({}).then(function(dbExamples) {
      console.log(dbExamples[0].dataValues.name)
      res.render("index", {
        rooms: dbExamples,
        room: "/room/" + dbExamples
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

  app.get("/room/:id", function(req, res) {
    db.room.findOne({ where: { id: req.params.id } }).then(function(dbExample) {
      console.log(dbExample)
      res.render("room", {
        room: dbExample
      });
    });
  });

  // Page for room showing playlist
  app.get("/room", function(req, res) {
    db.room.findOne
    res.render("room");
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
