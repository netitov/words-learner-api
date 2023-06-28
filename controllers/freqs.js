const Freq = require('../models/freq');
const { getFrequency } = require('../utils/api');

async function getData(req, res) {
  const words = req.params.words.split(',');
  try {
    //check if word in DB
    const response = await Freq.find({ word: { $in: words } });

    const foundWords = response.map(i => ({ word: i.word, fr: i.fr }));
    const notFoundWords = words.filter(i => !foundWords.some(w => i === w.word));

    const wordsToAdd = [];

    //get frequency for words which are not in DB
    for (const word of notFoundWords) {
      const apiResponse = await getFrequency(word);
      const addedObj = { word: apiResponse.word, fr: apiResponse.fr };
      wordsToAdd.push(addedObj);
    }

    const allWords = foundWords.concat(wordsToAdd);

    res.json(allWords);
  } catch (err) {
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};

async function createData(obj, res) {
  try {
    const response = await Freq.create({ word: obj.body.word, fr: obj.body.frequency.zipf });
    return res.json(response);
  } catch (err) {
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};

module.exports = { getData, createData };
