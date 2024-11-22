module.exports = (sequelize, DataTypes) => {
  const Stats = sequelize.define("Stats", {
    cleanSpeed: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    rawSpeed: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    accuracy: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    allWords: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    incorrectWords: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    allLetters: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    incorrectLetters: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
  });

  // Association: Stats belongs to one User
  Stats.belongsTo(sequelize.models.User, {
    foreignKey: "userId",
    as: "user",
  });

  return Stats;
};
