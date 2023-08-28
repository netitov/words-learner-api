const Words = require('../models/wordData');
const csv = require('csvtojson');
const { checkDictionary, getSynonyms } = require('../utils/api');
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

//get random words
async function getFilteredData(req, res) {
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

    console.log(filters)

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
        translatedWords.push({ ...obj, translation, otherTransl, lang: req.query.lang });
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

function getRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array?.length);
  return array[randomIndex];
}

//get words for quiz
async function getQuizOptions(req, res, next) {
  try {
    const userWords = req.body;
    const excludedWordsArray = userWords.map(i => i.word);
    const wordsForQuiz = [];

    // Get random words from DB for quiz options (answers)
    const randomWords = await Words.aggregate([
      { $match: {
        isValid: true,
        fr: { $gte: 3, $lte: 5 },
        word: { $nin: excludedWordsArray } //exclude initial words
      } },
      { $sample: { size: 25 } }
    ]);

    const synonymsPromises = randomWords.map(obj => getSynonyms(obj.word));
    const allSynonyms = await Promise.all(synonymsPromises);

    //add quiz options
    userWords.forEach(w => {
      const options = [];

      //perform loop until word doesnt have 3 options
      while (options.length < 3) {
        //add word-options if its not included
        const randomWord = getRandomElement(allSynonyms);
        if (!options.includes(randomWord.word)) {
          options.push(randomWord.word);
        }

        //stop loop if there are 3 options
        if (options.length >= 3) {
          break;
        }

        //add synonym to options if its not in options and not a synonym to word-answer
        const randomWordSyn = getRandomElement(allSynonyms); //get new random word for synonym
        if (randomWordSyn.syn.length > 0) {
          const randomSynonym = getRandomElement(randomWordSyn.syn);
          if (!options.includes(randomSynonym) && !randomWordSyn.syn.includes(w.word) && !randomSynonym.includes(' ')) {
            options.push(randomSynonym);
          }
        }
      }
      //add correct answer to the options
      const randomIndex = Math.floor(Math.random() * 4);
      options.splice(randomIndex, 0, w.word);

      wordsForQuiz.push({...w, options});
    });

    res.json(wordsForQuiz);
  } catch (error) {
    console.log(error);
    next(error);
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

module.exports = { getData, createData, getFilteredData, addValidity, getQuizOptions };
