const express = require('express');
require('dotenv').config()
const { getSeries } = require('./utils/api');

const { PORT = 3000 } = process.env;

const app = express();

app.listen(PORT, () => {
  //getSeries();
  //console.log(test(arr));
  console.log(`App listening on port ${PORT}`);
})
