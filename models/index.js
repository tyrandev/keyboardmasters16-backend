const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env.DB_STORAGE || "./databases/main.sqlite", // Database location
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import Models
db.User = require("./user")(sequelize, Sequelize);
db.Stats = require("./stats")(sequelize, Sequelize);
db.PageView = require("./pageView")(sequelize, Sequelize); // Add PageView model

// Define relationships (if needed)
db.User.hasMany(db.Stats, { foreignKey: "userId", as: "stats" });
db.Stats.belongsTo(db.User, { foreignKey: "userId", as: "user" });

module.exports = db;
