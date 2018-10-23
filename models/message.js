'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../config/database').sequelize;

module.exports = sequelize.define(
  'message',
  {
    text: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
  }
);
