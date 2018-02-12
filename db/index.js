const MongoClient = require('mongodb').MongoClient;

let db;

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/lolstrats';

let dbname;

if (process.env.MONGODB_URI) {
  const match = /.*mlab.com:[0-9]*\/(.*)/g.exec(process.env.MONGODB_URI);
  dbname = match[1];
} else {
  dbname = 'lolstrats';
}

MongoClient.connect(url, function(err, dbHandle) {
  db = dbHandle.db(dbname);
});

module.exports = {
  getDb() {
    return db;
  }
};
