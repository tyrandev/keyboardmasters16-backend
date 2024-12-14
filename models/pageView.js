module.exports = (sequelize, DataTypes) => {
  const PageView = sequelize.define(
    "PageView",
    {
      route: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ipAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      // Enable timestamps if you want to keep createdAt/updatedAt columns automatically handled
      timestamps: true, // This will ensure that createdAt and updatedAt are automatically managed
    }
  );

  return PageView;
};
