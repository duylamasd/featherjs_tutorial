'use strict';

const service = require('feathers-sequelize');
const Message = require('../models/message');
const assignLogin = require('../config/passport').assignLogin;
const authenticate = require('../config/passport').authenticatePassport;
const ensureAuthenticated = require('../config/passport').ensureServiceAuthenticated;
const ensureAdmin = require('../config/passport').ensureAdmin;

/**
 * Create message service.
 * @param {any} app The application
 */
module.exports = (app) => {
  app.use(
    '/messages',
    authenticate('jwt', { session: false }),
    assignLogin,
    service({
      Model: Message,
      paginate: {
        min: 0,
        default: 2,
        max: 5
      }
    })
  );

  const messages = app.service('messages');

  messages.hooks({
    before: {
      all: [ensureAuthenticated]
    },
    after: {
      find: [ensureAdmin]
    }
  });

  messages.on('created', (message, ctx) => {
    console.log(`created message: ${message.text}`);
  });
};
