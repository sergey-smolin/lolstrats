const express = require('express');
const ERRORS = require('../errors');

db = require('../../db');

const logoutRouter = express.Router();

logoutRouter.post('/', (req, res) => {

  req.session.destroy(err => {
    if (err) {
      res.send({
        result: "error",
        message: "error logging out"
      })
    } else {
      res.clearCookie('connect.sid');
      res.send({
        result: "success",
        message: "Logged out successfully"
      })
    }
  })
})

module.exports = logoutRouter;
