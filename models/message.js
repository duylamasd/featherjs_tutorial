'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../config/database').sequelize;

module.exports = sequelize.define(
  'message',
  {
    text: {
      type: Sequelize.STRING,
      allowNull: false
    },
    userId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    conversationId: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    indexes: [
      // conversation
      {
        name: 'conversation_to_message',
        fields: ['conversationId']
      }
    ]
  }
);
