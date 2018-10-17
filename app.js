'use strict'

require('dotenv').config();

const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const service = require('feathers-sequelize');

const env = require('./config/environment');
const sequelize = require('./config/database');

const app = express(feathers());

app.use(express.json());
app.configure(express.rest());
app.use(express.errorHandler());

app.get('/healthcheck', (req, res) => {
    res.send('OK');
});

app.listen(env.port).on('listening', () => {
    console.log(`Listening at port ${env.port}`);
});