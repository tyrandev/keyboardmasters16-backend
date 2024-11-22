const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

// Test Connection
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

// Models
db.User = require("./user")(sequelize, Sequelize);
db.Stats = require("./stats")(sequelize, Sequelize);

// Associations
// Update Associations in models/index.js
db.User.hasMany(db.Stats, { foreignKey: "userId", as: "stats" });
db.Stats.belongsTo(db.User, { foreignKey: "userId", as: "user" });

module.exports = db;
