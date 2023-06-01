const Word = require('../models/word');

async function getData(req, res) {
  try {
    const response = await Word.find({});
    return res.json(response);
  } catch (err) {
    console.log(err);
  }
};

async function createData(data) {
  try {
    const response = await Word.findOneAndUpdate(
      { word: data.word },
      { $inc: { sum: data.sum },
        $set: {
          word: data.word,
          fl: data.fl,
          audio: data.audio
        }
      },
      { upsert: true }
    );
    if (response) return response.word;
    else return;
  } catch (err) {
    console.log(err);
  }
};

async function updateWord(data) {
  try {
    const response = await Word.findOneAndUpdate(
      { word: data.word },
      { $inc: { sum: data.sum } }
    );
    if (response) return response.word;
    else return;
  } catch (err) {
    console.log(err);
  }
};

async function updateWordList(req, res) {
  const data = await Promise.all(req.body.map(async (word) => {
    return await updateWord(word);
  }));
  const newData = data.filter((i) => i !== undefined);
  return res.send(newData);
}

async function createWordList(req, res) {
  const data = await Promise.all(req.body.map(async (word) => {
    return await createData(word);
  }));
  const newData = data.filter((i) => i !== undefined);
  return res.send(newData);
}

module.exports = { getData, createWordList, updateWordList };
