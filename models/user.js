'use strict';

const Errors = require('@feathersjs/errors');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const SALT_ROUND = 12;
const MODEL_NAME = 'User';
const COLLECTION_NAME = 'Users';

/**
 * User schema
 */
var UserSchema = new Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  password: String,
  profile: {
    firstname: String,
    lastname: String,
    gender: {
      type: String,
      enum: ['Male', 'Female'],
      default: 'Male'
    },
    address: String,
    picture: { type: String, undefined: true }
  }
}, { timestamps: true, versionKey: false });

/**
 * Hash password before saving.
 */
UserSchema.pre('save', async function save(next) {
  const user = this;
  if (!user.isModified('password')) { return next(); }
  let hashedPassword = await bcrypt.hash(user.password, SALT_ROUND).catch(_ => undefined);
  if (hashedPassword) {
    user.password = hashedPassword;
    return next();
  }

  return next(new Errors.GeneralError('Failed on saving password'));
});

/**
 * Compare password.
 */
UserSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compareSync(candidate, this.password);
};

/**
 * User model
 */
module.exports = mongoose.model(MODEL_NAME, UserSchema, COLLECTION_NAME);
