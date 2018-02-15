const express = require('express');
const ERRORS = require('../errors');
const bcrypt = require('bcrypt');
const saltRounds = 10;

db = require('../../db');

const loginRouter = express.Router();

loginRouter.post('/', (req, res) => {
  const collection = db.getDb().collection('users');
  const { username, password } = req.body;

  collection.findOne({ username }, (err, user) => {
    if (err) {
      res.send({
        result: "error",
        error_code: ERORRS.ERROR_READING_USER,
        message: "There was an error retrieving user data"
      })
      return;
    }
    if (!user) {
      res.send({
        result: "error",
        error_code: ERRORS.CREDENTIALS_MISMATCH,
        message: "Incorrect login or password"
      })
    } else {
      bcrypt.compare(password, user.hash, function(err, match) {
        if (err) {
          res.send({
            result: "error",
            error_code: ERROR.ERROR_READING_USER,
            message: "There was an error retrieving user data"
          })
          return;
        }
        if (!match) {
          res.send({
            result: "error",
            error_code: ERROR.CREDENTIALS_MISMATCH,
            message: "Incorrect login or password"
          })
        }
        req.session.user = {
          username
        };
        console.log(req.session);
        res.send({
          result: "success",
          message: "Sign in successful",
          data: req.session.user
        });
      });
    }
  })
})

module.exports = loginRouter;
