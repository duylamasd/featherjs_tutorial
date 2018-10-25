'use strict';

require('dotenv').config();

const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const compression = require('compression');
const socketio = require('@feathersjs/socketio');
const swaggerUi = require('swagger-ui-express');

const env = require('./config/environment');
const sequelize = require('./config/database').sequelize;
const mongoose = require('./config/database').mongoose;
const services = require('./services');
const auth = require('./controllers/auth');
const passport = require('./config/passport').passport;

var swaggerDocument = require('./swagger.json');
swaggerDocument.host = env.host;

const app = express(feathers());

// Connect to databases
sequelize.authenticate().then(() => {
  console.log('Connected to mysql database successfully');
}).catch(err => {
  console.error('Error while connnecting to the mysql database');
  console.error(err);
  process.exit(1);
});

// Connect to user database
mongoose.connect(
  `${env.mongoImg}://${env.mongoUsername}:${env.mongoPassword}@${env.mongoHost}:${env.mongoPort}/${env.mongoDBName}`,
  {
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 1000, // Reconnect every second
    poolSize: 10, // Maximum number of sockets the MongoDB driver will keep open for the connection.
    bufferMaxEntries: 0, // Let database operations to fall immediately when driver is not connected.
    bufferCommands: false, // Let database operations to fall immediately when driver is not connected.
    connectTimeoutMS: 10000, // The MongoDB driver will wait for 10 seconds before falling.
    socketTimeoutMS: 40000, // The MongoDB driver will wait for 40 seconds before killing an inactive socket.
    useNewUrlParser: true, // Use the new parser
    useCreateIndex: true
  }
).then(_ => {
  console.log('Connected to mongodb database successfully');
}).catch(err => {
  console.error('Mongoose connection failed');
  console.error(err);
  process.exit(1);
});

app.hooks({
  error: async ctx => {
    console.error(ctx.code);
  }
});

app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(
    swaggerDocument,
    {
      validatorUrl: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'APIs documentation'
    }
  )
);

app.use(express.json());
app.use(compression());
app.use(passport.initialize());
app.use(passport.session());
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

services.messages(app);
services.users(app);

app.get('/healthcheck', (req, res) => {
  res.send('OK');
});
app.use('/auth', auth);

// Error handler
app.use(async (err, req, res, next) => {
  let errCtx = await err.toJSON();
  if (errCtx)
    return res.status(err.code || 500).json(errCtx);
  else {
    return res.status(500).json({
      message: 'No context',
      code: 500
    });
  }
});

app.listen(env.port).on('listening', () => {
  console.log(`Listening at port ${env.port}`);
});
