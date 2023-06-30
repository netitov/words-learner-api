const Words = require('../models/wordData');
const csv = require('csvtojson');

async function getData(req, res) {
  const words = req.params.words.split(',');

  try {
    //check if word in DB
    const response = await Words.find({ word: { $in: words } });

    /* const foundWords = response.map(i => ({ word: i.word, fr: i.fr }));
    const notFoundWords = words.filter(i => !foundWords.some(w => i === w.word));

    const wordsToAdd = [];

    //get frequency for words which are not in DB
    for (const word of notFoundWords) {
      const apiResponse = await getFrequency(word);
      const addedObj = { word: apiResponse.word, fr: apiResponse.fr };
      wordsToAdd.push(addedObj);
    }

    const allWords = foundWords.concat(wordsToAdd); */

    res.json(response);
  } catch (err) {
    res.status(500).json(err);
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

module.exports = { getData, createData };
