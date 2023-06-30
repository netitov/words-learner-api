const Words = require('../models/wordData');
const csv = require('csvtojson');
const { checkDictionary } = require('../utils/api');

async function getData(req, res) {
  const words = req.params.words.split(',');
  try {
    const response = await Words.find({ word: { $in: words } });
    res.json(response);
  } catch (err) {
    res.status(500).json(err);
  }
};

async function getFilteredData(req, res) {
  try {
    const filters = {};

    //use filters only of they're in the request
    if (req.query.frSt) {
      filters.fr = {
        $gte: parseInt(req.query.frSt),
        $lt: parseInt(req.query.frEn),
      };
    }
    if (req.query.pos) {
      filters.pos = req.query.pos;
    }

    console.log(filters)

    //get random docs
    const result = await Words.aggregate([
      { $match: filters },
      { $sample: { size: 200 } } //amount of random documents
    ]);

    //add translation
    const translatedWords = [];

    for (const obj of result) {
      const apiResponse = await checkDictionary({ langs: 'en-ru', text: obj.word });
      const translation = apiResponse.length !== 0 ? apiResponse[0].tr[0].text : '';

      if (translation !== '') {
        translatedWords.push({ ...obj, translation });
      }

      if (translatedWords.length === 5) {
        break;
      }
    }

    res.json(translatedWords);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

async function createData(req, res) {
  try {
    const jsonArray = await csv({
      delimiter: ';',
    }).fromFile(req.file.path);

    const newArr = jsonArray.map((i) => (
      {
        word: i.word,
        pos: i.pos,
        filmPer: parseFloat(i.filmPer.replace(",", ".")),
        fr: parseFloat(i.fr.replace(",", ".")),
      }
    ))

    const batchSize = 1000;

    //batch the DB requests; file may contains more 50,000 records
    for (let i = 0; i < newArr.length; i += batchSize) {
      const batch = newArr.slice(i, i + batchSize);
      await Words.insertMany(batch);
    }

    return res.json('Uploaded!');
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { getData, createData, getFilteredData };
