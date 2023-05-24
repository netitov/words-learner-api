const express = require('express');
require('dotenv').config()
const bodyParser = require('body-parser');
const { getSeries } = require('./utils/api');
const wordsRoute = require('./routes/words');
const queueRoute = require('./routes/queue');
const mongoose = require('mongoose');

const { PORT = 3008 } = process.env;

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/wordslearner', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/', wordsRoute);
app.use('/', queueRoute);

app.listen(PORT, () => {
  //getSeries();
  //console.log(test(arr));
  console.log(`App listening on port ${PORT}`);
})
