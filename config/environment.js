'use strict';

module.exports = {
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  dbPort: process.env.DB_PORT,
  mongoImg: process.env.MONGO_IMG,
  mongoUsername: process.env.MONGO_USER,
  mongoPassword: process.env.MONGO_PASSWORD,
  mongoHost: process.env.MONGO_HOST,
  mongoPort: process.env.MONGO_PORT,
  mongoDBName: process.env.MONGO_DBNAME,
  port: process.env.PORT,
  secretKey: process.env.SECRET_KEY,
  host: process.env.HOST
};
