'use strict';

const async = require('async');
const Errors = require('@feathersjs/errors');
const passport = require('passport');
const passportJwt = require('passport-jwt');
const passportLocal = require('passport-local');
const User = require('../models/user');
const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJWT = passportJwt.ExtractJwt;
const secretKey = require('./environment').secretKey;

passport.serializeUser((user, done) => {
  return done(undefined, user._id);
});

passport.deserializeUser(async (id, done) => {
  let user = await User.findById(id, {
    _id: 0,
    password: 0
  });

  if (user) { return done(undefined, user); }

  return done(new Errors.NotFound(
    `User ${id} not found`,
    { id: id }
  ));
});

passport.use(new LocalStrategy(
  { usernameField: 'user' },
  (user, password, done) => {
    async.waterfall([
      // Find user info
      (done) => {
        User.findOne({
          $or: [
            { username: user },
            { email: user },
            { phone: user }
          ]
        }).then(userInfo => {
          if (userInfo) { done(undefined, userInfo); }
          else {
            done(new Errors.BadRequest(
              'Invalid user',
              { user: user }
            ));
          }
        }).catch(_ => {
          done(new Errors.BadRequest(
            `Invalid user`,
            { user: user }
          ));
        });
      },
      // Check password
      (userInfo, done) => {
        let isPasswordMatch = userInfo.comparePassword(password);
        if (!isPasswordMatch) {
          return done(new Errors[401](
            'Invalid password',
            { password: password }
          ));
        }

        let userInfoForLogin = Object.assign(
          {},
          userInfo.toJSON(),
          {
            password: undefined,
            profile: undefined
          }
        );
        return done(undefined, userInfoForLogin);
      }
    ], (err, res) => {
      if (err) { return done(err); }
      done(undefined, res);
    });
  }
));

passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: secretKey,
    issuer: 'duylam',
    algorithms: ['HS256'],
    jsonWebTokenOptions: {
      algorithms: ['HS256'],
      issuer: 'duylam'
    }
  },
  (payload, done) => {
    if (!payload) {
      return done(new Errors[401](
        'Invalid token'
      ));
    }

    let authData = Object.assign(
      { authType: 'jwt' },
      payload
    );

    return done(undefined, authData);
  }
));

/**
 * Passport authentication middleware
 * @param {String[] | String} strat Strategy/strategies for authentication.
 * @param {any} options Authentication options (OPTIONAL)
 */
const authenticatePassport = (strat, options) => {
  return (req, res, next) => {
    passport.authenticate(
      strat,
      options,
      (err, user, info) => {
        if (err) { next(err); }

        if (!user) {
          return next(new Errors[401](
            'Unauthorized'
          ));
        }

        req.login(user, err => {
          if (err) {
            return next(new Errors[401](
              'Unauthorized'
            ));
          }

          return next();
        });
      }
    )(req, res, next);
  };
}

module.exports = {
  passport,
  authenticatePassport
};
