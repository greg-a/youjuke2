module.exports = function (sequelize, DataTypes) {
    var Room = sequelize.define("room", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: DataTypes.TEXT
    });

    Room.associate = function (models) {
        Room.hasMany(models.song, {
            onDelete: "cascade"
        });
    };

    return Room;
};
