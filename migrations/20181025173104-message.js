'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
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
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('message');
  }
};
