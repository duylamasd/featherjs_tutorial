'use strict';

const Errors = require('@feathersjs/errors');
const express = require('@feathersjs/express');
const jwt = require('jsonwebtoken');
const secretKey = require('../config/environment').secretKey;
const passport = require('../config/passport').passport;
const router = express.Router();

router.post(
  '/login',
  (req, res, next) => {
    passport.authenticate(
      'local',
      { session: false },
      (err, user, info) => {
        if (err) { return next(err) };

        req.login(user, err => {
          if (err) {
            return next(new Errors.GeneralError(
              'Login failed',
            ));
          }

          const token = jwt.sign(
            user,
            secretKey,
            {
              algorithm: 'HS256',
              issuer: 'duylam',
              expiresIn: 3600
            }
          );

          return res.send({
            type: 'Bearer',
            token: token
          });
        });
      }
    )(req, res, next);
  }
);

module.exports = router;
