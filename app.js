const express = require('express');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
/* const wordsRoute = require('./routes/words');
const queueRoute = require('./routes/queue');
const apicallsRoute = require('./routes/apicalls');
const sourceRoute = require('./routes/sources');
const languageRouter =  require('./routes/languages');
const dictionaryRouter =  require('./routes/dictionary');
const freqRouter =  require('./routes/freqs');
const wordDataRouter =  require('./routes/wordData');
const translateRouter =  require('./routes/translate'); */
const route = require('./routes/index');
const mongoose = require('mongoose');
const errorHandler = require('./middlewares/errorHandler');
const { isCelebrateError } = require('celebrate');

const { PORT = 3008 } = process.env;

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/wordslearner', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());

app.use('/', route);

//celebrate errors
//app.use(errors());

app.use((err, req, res, next) => {
  if (isCelebrateError(err)) {
    next(err);
  } else {
    next(err);
  }

});

app.use(errorHandler);

//error logger


app.listen(PORT, () => {
  //getSeries();

  //add sources to DB
  //addDataDB(sources, 'sources');
  console.log(`App listening on port ${PORT}`);
})
