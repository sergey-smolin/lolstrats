const util = require('util');
const fetch = require('node-fetch');
const express = require('express');
const queryString = require('../../utils').queryString;
const db = require('../../db');

const API_KEY = 'AIzaSyDP8_FbyKEyuT_-fIa1l7LcUsJzW-rV5j0';
const GOLD_STANDARD_PRESENT = 'A video with this url has already been submitted, we will review your submission and if it represents the video better we will be using your submission instead';
const ERROR_ADDING_RECORD = 'There was an error adding video';
const SUCCESS_ADDING_VIDEO = 'The video has been added successfully';
const SUBMISSION_EXISTS = 'Submission already exists';
const CODE_ERROR_ADDING_RECORD = 0;
const CODE_SUBMISSION_EXISTS = 1;

const videosRouter = express.Router();

const buildQuery = preparedQuery => preparedQuery.reduce((memo, next) => {
  memo[next.name] = next.query;
  return memo;
}, {});

const getVideos = (req, res) => {
  const collection = db.getDb().collection('videos');

  let categories = req.query.categories ? req.query.categories.split(',') : undefined;
  let champions = req.query.champions ? req.query.champions.split(',') : undefined;
  let items = req.query.items ? req.query.items.split(',') : undefined;
  let runes = req.query.runes ? req.query.runes.split(',') : undefined;

  let initialElements = {
    champions,
    categories,
    runes,
    items,
  };

  const filteredElements = Object.keys(initialElements).filter(key => initialElements[key]);
  preparedQuery = filteredElements
    .map(key => ({ name: key, query: { $in: initialElements[key] } }));

  const $match = { goldStandard: { $exists: true }, ...buildQuery(preparedQuery) };

  const commonFields = {
    id: 1,
    ytData: 1,
    champions: 1,
    items: 1,
    runes: 1,
    categories: 1,
    elementsNamesIds: 1,
  };

  const query = [
    { $match },
    { $project: {
      ...commonFields,
      relevance: {
        $sum: filteredElements.map(element =>
          ({ $size: { $setIntersection: [ initialElements[element], `$${element}` ] } }))
      }
    } },
    { $sort: { relevance: -1 } },
    { $project: {
      ...commonFields
    } }
  ];

  collection.aggregate(query).toArray(function (err, docs) {
    const result = { result: docs };
    if (!docs) {
      result.message = 'No database results';
    }
    res.send(result);
  });
};

const addVideoToDB = (video, ytData, res) => {
  const collection = db.getDb().collection('videos');
  collection.findOne(video, function (err, doc) {
    let response = {};
    let query;
    if (err) {
      response.result = "error";
      response.error_code = CODE_ERROR_ADDING_RECORD;
      response.message = ERROR_ADDING_RECORD;
    } else if (doc) {
      response.result = "error";
      response.error_code = CODE_SUBMISSION_EXISTS;
      response.message = SUBMISSION_EXISTS;
    } else {
      collection.findOne({ id: video.id }, function (err, doc) {
        let response = {};
        let query;
        let goldStandardPresent;
        if (err) {
          response.result = "error";
          response.error_code = CODE_ERROR_ADDING_RECORD;
          response.message = ERROR_ADDING_RECORD;
        } else if (doc) {
          goldStandardPresent = true;
          query = video;
        } else {
          query = { ...video, goldStandard: true };
        }
        if (query) {
          query = { ...query, createdAt: new Date(), ytData };
          collection.insertOne(query, function (err, doc) {
            let response = {};
            if (err) {
              response.result = "error";
              response.error_code = CODE_ERROR_ADDING_RECORD;
              response.message = ERROR_ADDING_RECORD;
            } else {
              response.result = "success";
              response.message = goldStandardPresent ? GOLD_STANDARD_PRESENT :
                SUCCESS_ADDING_VIDEO;
            }
            res.send(response);
          })
        } else {
          res.send(response);
        }
      });
      return;
    }
    res.send(response);
  })

};

const addVideo = (req, res) => {
  fetch('https://www.googleapis.com/youtube/v3/videos?' +
    queryString({
      'id': req.body.id,
      'part': 'snippet',
      'key': API_KEY
    })
  ).then(res => res.json()).then(json => {
    addVideoToDB(req.body, json.items[0].snippet, res);
  });
};

// videosRouter.use(function (req, res, next) {
//   console.log('videos router', req.url);
//   next();
// })

videosRouter.post('/add', addVideo);
videosRouter.get('/', getVideos);

module.exports = videosRouter;
