'use strict'

require('dotenv').config();

const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const compression = require('compression');
const socketio = require('@feathersjs/socketio');
const service = require('feathers-sequelize');

const env = require('./config/environment');

const Message = require('./models/message');

const app = express(feathers());

app.use(express.json());
app.use(compression());
app.configure(express.rest());
app.configure(socketio(io => {
    io.on('connection', socket => {
        socket.emit('news', { text: 'A new client connected!' });
    });

    io.on('healthcheck', data => {
        console.log(data);
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

app.use(express.errorHandler());

app.get('/healthcheck', (req, res) => {
    app.io.emit('healthcheck', 'OK');
    res.send('OK');
});

app.listen(env.port).on('listening', () => {
    console.log(`Listening at port ${env.port}`);
});