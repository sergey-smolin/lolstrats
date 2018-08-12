const express = require('express');
const ERRORS = require('../errors');
const bcrypt = require('bcrypt-nodejs');
const saltRounds = 10;

db = require('../../db');

const registerRouter = express.Router();

registerRouter.post('/', (req, res) => {
  const collection = db.getDb().collection('users');
  const { username, password } = req.body;

  collection.findOne({ username: req.body.username }, (err, doc) => {
    if (err) {
      res.send({
        result: "error",
        error_code: ERRORS.ERROR_ADDING_USER,
        message: "There was an error adding a user"
      })
    }
    if (doc) {
      res.send({
        result: "error",
        error_code: ERRORS.ERROR_USER_EXISTS,
        message: "A user with this username already exists"
      })
    } else {
      const salt = bcrypt.genSaltSync(saltRounds);
      bcrypt.hash(password, salt, null, function(err, hash) {
        collection.insertOne({ username, hash }, (err, doc) => {
          if (err) {
            res.send({
              result: err,
              error_code: ERRORS.ERROR_ADDING_USER,
              message: "There was an error registring a user"
            })
            return;
          }
          res.send({
            result: "success",
            message: "A user has been added successfully"
          })
        })
      });
    }
  })
})

module.exports = registerRouter;
