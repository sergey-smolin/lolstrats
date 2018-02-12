const db = require('../../db');

const express = require('express');

const videoRouter = express.Router();

const ERROR_READING_VIDEO = 2;
const ERROR_READING_VIDEO_MESSAGE = "There was an error getting the video";

const getVideo = (req, res) => {
  const collection = db.getDb().collection('videos');
  collection.findOne({ id: req.body.id }, (err, data) => {
    let response = {};
    if (err) {
      response.result = "error";
      response.error_code = ERROR_READING_VIDEO;
      response.message = ERROR_READING_VIDEO_MESSAGE;
    } else {
      response.result = "success";
      response.data = data;
    }
    res.send(response);
  });
}

videoRouter.get('/list/:id', getVideo);

module.exports = videoRouter;
