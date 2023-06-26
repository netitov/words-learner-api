const Freq = require('../models/freq');
const { getFrequency } = require('../utils/api');

async function getData(req, res) {
  try {
    //check if word in DB
    const response = await Freq.findOne({ word: req.params.word });
    //if it's not there make request and add to DB
    if (!response) {
      const data = await getFrequency(req.params.word);
      return res.json(data);
    } else {
      return res.json(response);
    }
  } catch (err) {
    console.log(err);
  }
};

async function createData(obj, res) {
  try {
    const response = await Freq.create({ word: obj.body.word, fr: obj.body.frequency.zipf });
    return res.json(response);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getData, createData };
