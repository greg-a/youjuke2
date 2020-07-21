module.exports = function(sequelize, DataTypes) {
    var Played = sequelize.define("played", {
      deezerID: DataTypes.INTEGER,
      artistName: DataTypes.STRING,
      songName: DataTypes.STRING,
      songURL: DataTypes.TEXT,
      thumbnail: DataTypes.TEXT,
      upvote: DataTypes.INTEGER
    });
    return Played;
  };