module.exports = function(sequelize, DataTypes) {
  var Song = sequelize.define("song", {
    deezerID: DataTypes.INTEGER,
    artistName: DataTypes.STRING,
    songName: DataTypes.STRING,
    songURL: DataTypes.TEXT,
    thumbnail: DataTypes.TEXT,
    upvote: DataTypes.INTEGER
  });

  Song.associate = function(models) {
    Song.belongsTo(models.room, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Song;
};
