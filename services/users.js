'use strict';

const service = require('feathers-mongoose');
const User = require('../models/user');
const assignLogin = require('../config/passport').assignLogin;
const authenticate = require('../config/passport').authenticatePassport;
const ensureAuthenticated = require('../config/passport').ensureServiceAuthenticated;

/**
 * Create user service
 */
module.exports = app => {
  app.use('/users', authenticate('jwt'), assignLogin, service({
    Model: User,
    lean: false,
    paginate: {
      min: 0,
      max: 100,
      default: 2
    }
  }));

  const users = app.service('users');
  users.hooks({
    before: {
      all: [],
      find: [ensureAuthenticated],
      get: [ensureAuthenticated],
      create: [],
      update: [ensureAuthenticated],
      patch: [ensureAuthenticated],
      remove: [ensureAuthenticated]
    },
    after: {
      all: [],
      find: [
        async (ctx) => {
          if (ctx.result.data) {
            ctx.result.data.forEach(user => {
              user.password = undefined;
            });
          }
          return ctx;
        }
      ],
      get: [
        async (ctx) => {
          ctx.result.password = undefined;
          return ctx;
        }
      ],
      create: [
        async (ctx) => {
          ctx.result.password = undefined;
          return ctx;
        }
      ],
      update: [],
      patch: [],
      remove: []
    }
  });
};
