const express = require('express');
const videosRoutes = require('./handlers/videos');
const videoRoutes = require('./handlers/video');
const login = require('./handlers/login');
const logout = require('./handlers/logout');
const register = require('./handlers/register');
const fs = require('fs');
const db = require('../db');
const ERRORS = require('./errors');

const apiRouter = express.Router();

const getItems = (req, res) => {
  res.sendFile(process.cwd() + '/data/items.json');
}

const getChampions = (req, res) => {
  res.sendFile(process.cwd() + '/data/champions.json');
}

const getRunes = (req, res) => {
  res.sendFile(process.cwd() + '/data/runes.json');
}

const getCategories = (req, res) => {
  res.sendFile(process.cwd() + '/data/categories.json');
}

// apiRouter.use(function (req, res, next) {
//   console.log(req.url);
//   next();
// })

apiRouter.get('/user', (req, res) => {
  console.log(req.session);
  if (req.session.user) {
    res.send({
      result: 'success',
      data: req.session.user
    })
  } else {
    res.send({
      result: 'error',
      error_code: ERRORS.ERROR_NOT_LOGGED_IN,
      message: "The user is not logged in"
    })
  }
})

apiRouter.get('/items', getItems);
apiRouter.get('/champions', getChampions);
apiRouter.get('/runes', getRunes);
apiRouter.get('/categories', getCategories);
apiRouter.use('/videos', videosRoutes);
apiRouter.use('/video', videoRoutes);
apiRouter.use('/register', register);
apiRouter.use('/login', login);
apiRouter.use('/logout', logout);

module.exports = apiRouter;
