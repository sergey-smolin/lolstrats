const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');
const app = express();

const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use('/api', apiRoutes);
app.use(express.static(path.resolve(__dirname, './react-ui/build')));

app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, './react-ui/build', 'index.html'));
});

app.listen(port, () => console.log('Example app listening on port 5000!'));
