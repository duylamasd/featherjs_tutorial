'use strict';

const service = require('feathers-sequelize');
const Message = require('../models/message');

/**
 * Create message service.
 * @param {any} app The application
 */
module.exports = (app) => {
    app.use('/messages', service({
        Model: Message,
        paginate: {
            min: 0,
            default: 2,
            max: 5
        }
    }));

    const messages = app.service('messages');
    messages.on('created', (message, ctx) => {
        console.log(`created message: ${message.text}`);
        console.log(ctx);
    });
};