const Words = require('../models/wordData');
const csv = require('csvtojson');
const { checkDictionary } = require('../utils/api');
const nlp = require('compromise');

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
  console.log(req.query)
  try {
    const filters = {
      isValid: true
    };

    //use filters only of they're in the request
    if (req.query.frSt) {
      filters.fr = {
        $gte: parseInt(req.query.frSt),
        $lte: parseInt(req.query.frEn),
      };
    }
    if (req.query.filmPerSt) {
      filters.filmPer = {
        $gte: parseInt(req.query.filmPerSt),
        $lte: parseInt(req.query.filmPerEn),
      };
    }
    if (req.query.pos) {//add if empty - then only Noun, verb adj
      filters.pos = { $in: req.query.pos.split(',') };
    }

    //get random docs
    const result = await Words.aggregate([
      { $match: filters },
      { $sample: { size: 200 } } //amount of random documents
    ]);

    //add translation
    const translatedWords = [];

    for (const obj of result) {
      const apiResponse = await checkDictionary({ langs: 'en-' + req.query.lang, text: obj.word });
      const translation = apiResponse.length > 0 ? apiResponse[0].tr[0].text : '';
      const otherTransl =  apiResponse.length > 0 ? apiResponse : '';

      if (translation !== '') {
        translatedWords.push({ ...obj, translation, otherTransl });
      }

      if (translatedWords.length === 10) {
        break;
      }
    }

    res.json(translatedWords);
  } catch (error) {
    console.log(error)
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

function checkValidity(word, pos) {
  const parsedWord = nlp(word);

  const verbInf = parsedWord.verbs().toInfinitive().text();
  const nounSing = parsedWord.nouns().isSingular().text();

  if (process.env.OFFENSIVE_ARR.includes(word)) {
    return false;
  }
  if (pos === 'Verb' && verbInf === word) {
    return true;
  }
  if (pos === 'Noun' && nounSing === parsedWord) {
    return true;
  }
  if (pos === 'Noun' && !/(s)$/.test(word)) {
    return true;
  }
  if (pos === 'Adjective') {
    return true;
  }

  return false;
}

async function addValidity(req, res) {
  try {
    const pageSize = 1000;
    let page = 0;

    while (true) {
      const words = await Words.find().skip(page * pageSize).limit(pageSize);

      if (words.length === 0) {
        break;
      }

      for (const word of words) {

        word.isValid = checkValidity(word.word, word.pos);
        await word.save();
      }

      page++;
    }
    res.json({ success: 'Data added' });

  } catch (err) {
    console.log(err)
    res.status(500).json(err.message);
  }

}

module.exports = { getData, createData, getFilteredData, addValidity };
