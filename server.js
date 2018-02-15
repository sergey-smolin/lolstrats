const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');
const MongoStore = require('connect-mongo')(session);
const app = express();

const port = process.env.PORT || 5000;
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/lolstrats';

app.use(session({
  secret: 'The Sun is shining',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ url }),
  cookie: {
    httpOnly: false
  },
}))

app.use(bodyParser.json());
app.use('/api', apiRoutes);
app.use(express.static(path.resolve(__dirname, './react-ui/build')));

app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, './react-ui/build', 'index.html'));
});

app.listen(port, () => console.log('Example app listening on port 5000!'));
