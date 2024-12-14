module.exports = (sequelize, DataTypes) => {
  const PageView = sequelize.define("PageView", {
    route: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });
  return PageView;
};
