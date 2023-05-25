const express = require('express');
require('dotenv').config()
const bodyParser = require('body-parser');
const { getSeries } = require('./utils/api');
const wordsRoute = require('./routes/words');
const queueRoute = require('./routes/queue');
const apicallsRoute = require('./routes/apicalls');
const sourceRoute = require('./routes/sources');
const mongoose = require('mongoose');
const { addDataDB } = require('./utils/api');
const { sources } = require('./constants');

const { PORT = 3008 } = process.env;

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/wordslearner', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/', wordsRoute);
app.use('/', queueRoute);
app.use('/', apicallsRoute);
app.use('/', sourceRoute);

app.listen(PORT, () => {
  //getSeries();

  //add sources to DB
  //addDataDB(sources, 'sources');
  console.log(`App listening on port ${PORT}`);
})
