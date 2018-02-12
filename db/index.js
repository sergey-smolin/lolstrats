const MongoClient = require('mongodb').MongoClient;

let db;

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/lolstrats';
const dbname = process.env.MONGODB_URI ? 'heroku_v09sc7ks' : 'lolstrats';

MongoClient.connect(url, function(err, dbHandle) {
  db = dbHandle.db(dbname);
});

module.exports = {
  getDb() {
    return db;
  }
};
