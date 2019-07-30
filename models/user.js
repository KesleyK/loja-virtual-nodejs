const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const userSchema = sequelize.define('user', {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = userSchema;