module.exports = function(sequelize, DataTypes) {
  var Song = sequelize.define("song", {
    deezerID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    artistName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    songName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    songURL: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    thumbnail: DataTypes.TEXT,
    upvote: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    played: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    pending: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
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
