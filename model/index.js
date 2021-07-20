const dbConfig = require("../database/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.movies = require("./movie.js")(sequelize, Sequelize);
db.comments = require("./comment.js")(sequelize, Sequelize);

db.movies.hasMany(db.comments, {  foreignKey: "movieId", targetKey:"id"  });
db.comments.belongsTo(db.movies, {foreignKey: "movieId", targetKey:"id"});

module.exports = db;
