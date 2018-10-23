'use strict';

const service = require('feathers-mongoose');
const User = require('../models/user');

/**
 * Create user service
 */
module.exports = app => {
  app.use('/users', service({
    Model: User,
    lean: false,
    paginate: {
      min: 0,
      max: 100,
      default: 2
    }
  }));
};
