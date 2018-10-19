'use strict';

require('dotenv').config();

const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const compression = require('compression');
const socketio = require('@feathersjs/socketio');
const service = require('feathers-sequelize');

const env = require('./config/environment');
const sequelize = require('./config/database');

const Message = require('./models/message');

const app = express(feathers());

sequelize.authenticate().then(() => {
    console.log('Connect to database successfully');
}).catch(err => {
    console.error('Error while connnecting to the database');
    console.error(err);
    process.exit(1);
});

app.use(express.json());
app.use(compression());
app.configure(express.rest());
app.configure(socketio(io => {
    io.on('connection', socket => {
        socket.emit('news', { text: 'A new client connected!' });
        socket.on('healthcheck', data => {
            console.log(data);
        });
        console.log(io);
    });

    // Registering Socket.io middleware
    io.use((socket, next) => {
        socket.feathers.referrer = socket.request.referrer;
        next();
    });
}));

app.use('/messages', service({
    Model: Message,
    paginate: {
        default: 2,
        max: 4
    }
}));

const messages = app.service('messages');
messages.on('created', (message, ctx) => {
    console.log(`created message: ${message.text}`);
    console.log(ctx);
});

app.get('/healthcheck', (req, res) => {
    res.send('OK');
});

app.use(express.errorHandler());

app.listen(env.port).on('listening', () => {
    console.log(`Listening at port ${env.port}`);
});