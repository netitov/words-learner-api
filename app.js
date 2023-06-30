const express = require('express');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const { getWordsFromSeries } = require('./utils/api');
const wordsRoute = require('./routes/words');
const queueRoute = require('./routes/queue');
const apicallsRoute = require('./routes/apicalls');
const sourceRoute = require('./routes/sources');
const languageRouter =  require('./routes/languages');
const dictionaryRouter =  require('./routes/dictionary');
const freqRouter =  require('./routes/freqs');
const wordDataRouter =  require('./routes/wordData');
const translateRouter =  require('./routes/translate');
const mongoose = require('mongoose');
const { addDataDB } = require('./utils/serverApi');
const { sources } = require('./utils/constants');

const { PORT = 3008 } = process.env;

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/wordslearner', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());

app.use('/', wordsRoute);
app.use('/', queueRoute);
app.use('/', apicallsRoute);
app.use('/', sourceRoute);
app.use('/', languageRouter);
app.use('/', dictionaryRouter);
app.use('/', freqRouter);
app.use('/', wordDataRouter);
app.use('/', translateRouter);

app.listen(PORT, () => {
  //getSeries();

  //add sources to DB
  //addDataDB(sources, 'sources');
  console.log(`App listening on port ${PORT}`);
})
