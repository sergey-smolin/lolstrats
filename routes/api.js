const express = require('express');
const videosRoutes = require('./handlers/videos');
const videoRoutes = require('./handlers/video');
const fs = require('fs');

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

apiRouter.get('/items', getItems);
apiRouter.get('/champions', getChampions);
apiRouter.get('/runes', getRunes);
apiRouter.get('/categories', getCategories);
apiRouter.use('/videos', videosRoutes);
apiRouter.use('/video', videoRoutes);

module.exports = apiRouter;
