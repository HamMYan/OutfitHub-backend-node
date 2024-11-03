const Sequelize = require("sequelize")

const sequelize = new Sequelize("outfit_hub", "root", "", {
    host: "localhost",
    port: 3306,
    dialect: "mysql"
});

const User = require('./User')(sequelize, Sequelize)

sequelize.sync()

module.exports = { User }