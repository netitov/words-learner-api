const fetch = require('node-fetch');
const { checkWordInDB, getDataFromDB, addWordToDB, addDataDB, getQueueWordsDB, updateDataDB,
  deleteQueueDB, updateApiCallsDB, updateLanguagesDB, updateDictionaryDB, addFrequencyDB } = require('./serverApi');
const { REQ_LIMIT } = require('./config');


function filterWords(arr) {
  const newArr = [];
  arr.forEach((i) => {
    i.text.split(' ').forEach((j) => {
      if (!j.includes("-") && isNaN(Number(j)) && !j.includes("'") && !j.includes('[') && !j.includes(']')) {
        const wordToAdd = j.replace(/[^a-zA-Z ]/g, '').toLowerCase();
        if (!newArr.some((el) => el.word === wordToAdd)) {
          newArr.push({
            word: wordToAdd,
            sum: 1
          });
        } else {
          const foundObj = newArr.find((obj) => obj.word === wordToAdd);
          foundObj.sum ++;
        }
      }
    })
  })
  return newArr.filter((i) => i.word !== '');
}

function getWord(data) {
  if (data.cxs) {
    return data.cxs[0].cxtis[0].cxt;
  } else if (data.meta.id.includes(':')) {
    const index = data.meta.id.indexOf(':');
    return data.meta.id.substring(0, index);
  } else {
    return data.meta.id;
  }
}

function getAudio(data) {
  if (data.hwi.prs === undefined) return '';
  else {
    const file = data.hwi.prs.find((i) => i.sound).sound.audio;
    const subdirectory = file.substring(0, 3) === 'bix' ? 'bix' :
      file.substring(0, 2) === 'gg' ? 'gg' : file.substring(0, 1);
    return `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdirectory}/${file}.mp3`;
  }

}

async function clearQueue(wordsInDB, wordsForAdaptation, targetQueue) {
  let wordsToRemove = [];
  wordsInDB.forEach((i) => wordsToRemove.push(i));
  wordsForAdaptation.forEach((i) => wordsToRemove.push(i.word));
  const updatedQueue = await updateDataDB({ sourceId: targetQueue.sourceId, words: wordsToRemove }, 'queue');

  if (updatedQueue.dataLength < 1) {
    deleteQueueDB({ sourceId: targetQueue.sourceId });
  }
}

//get word data from dictionary api
async function getWordData(obj) {
  try {
    const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${obj.word}?key=${process.env.WORDS_API_KEY}`)
    const data = await response.json();
    const element = data[0];

    if (element.meta === undefined) return
    else {
      return {
        word: getWord(element),
        fl: element.fl,
        audio: getAudio(element),
        sum: obj.sum
      }
    }

  } catch (err) {
    console.error(err);
  }
}

async function mapGetWordData(words) {
  //log api calls
  const today = new Date().toISOString().slice(0, 10);
  updateApiCallsDB({ date: today, words: words.length });

  //get word data from dictionary api
  const data = await Promise.all(words.map(async (word) => {
    return await getWordData(word);
  }));
  return data;
}

//get series data from DB, map getWordsFromSeries
async function mapGetWordsFromSeries() {
  const seriesFromDB = await getDataFromDB('sources');
  const data = await Promise.all(seriesFromDB.map(async (i) => {
    return await getWordsFromSeries(i.id);
  }));

}

//get words from series and add to queue
async function getWordsFromSeries(id) {
  debugger
  try {
    const response = await fetch(`https://subtitles-for-youtube2.p.rapidapi.com/subtitles/${id}`, {
      headers: {
        'X-RapidAPI-Key': process.env.API_KEY
      }}
    )
    debugger
    const seriesData = await response.json();
    const filteredWords = filterWords(seriesData);

    //save all words from subs to db (queue)
    addDataDB({ sourceId: id, words: filteredWords }, 'queue');

    //clear source in DB
    updateDataDB({ id }, 'sources');

  } catch (err) {
    console.error(err);
  }
}

//get words from queue, check them in dictionary, save to DB, delete from queue, count api queries
async function handleWords() {

  //get words from queue
  const allQueue = await getQueueWordsDB();
  const targetQueue = allQueue[0];

  //check if word in DB to exclude from req
  const wordsInDB = await checkWordInDB(targetQueue.words);

  //get api calls amount to limit request
  const apiCalls = await getDataFromDB('apicalls');
  const today = new Date().toISOString().slice(0, 10);
  const apiCallsAmount = (apiCalls.find((i) => i.date === today) === undefined) ? 0 : (apiCalls.find((i) => i.date === today));
  const wordsForAdaptation = targetQueue.words.filter((i) => !wordsInDB.includes(i.word)).slice(0, REQ_LIMIT - apiCallsAmount);

  //query to dictionary if word isn't at DB
  const data = await mapGetWordData(wordsForAdaptation);
  const wordsToDB = data.filter((i) => i !== undefined);

  //save words to DB
  addWordToDB(wordsToDB);

  //clean the queue
  clearQueue(wordsInDB, wordsForAdaptation, targetQueue);
}

//every month?
//get list of languages for translation from YT and update in DB
async function getLanguages() {
  try {
    const response = await fetch(`https://translate.yandex.net/api/v1.5/tr.json/getLangs?key=${process.env.YTRANSL_KEY}&ui=en`, {
      method: 'POST' }
    )
    const data = await response.json();
    updateLanguagesDB(data);
  } catch (err) {
    console.error(err);
  }
}

//every month?
//get dictionary for translation from YD and update in DB
async function getDictionary() {
  try {
    const response = await fetch(`https://dictionary.yandex.net/api/v1/dicservice.json/getLangs?key=${process.env.YDICTION_KEY}`, {
      method: 'GET' }
    )
    const data = await response.json();
    updateDictionaryDB(data);
    console.log('done')
  } catch (err) {
    console.error(err);
  }
}

async function getFrequency(word) {
  try {
    const response = await fetch(`https://wordsapiv1.p.rapidapi.com/words/${word}/frequency`,
    {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.API_KEY,
        'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
      }
    }
    );
    const result = await response.json();
    if (result.success === false || !result.frequency) {
      return { word, fr: 1 }
    } else {
      const data = await addFrequencyDB(result);
      return data;
    }
  } catch (err) {
    console.error(err);
  }
}

//get text translation from yandex api
async function getTranslation({ langs, text }) {
  try {
    const response = await fetch(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${process.env.YTRANSL_KEY}&text=${text}&lang=${langs}`,
    { method: 'POST' }
    );
    const result = await response.json();
    return result;
  } catch (err) {
    console.error(err);
  }
}

//get text word translation from yandex dictionary api
//in dictionary api can get one word translation and word data in dictionary
async function checkDictionary({ langs, text }) {
  try {
    const response = await fetch(`https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${process.env.YDICTION_KEY}&lang=${langs}&text=${text}`,
    { method: 'GET' }
    );
    const result = await response.json();
    return result.def;
  } catch (err) {
    next(err);
  }
}

//find word (and translate) in dictionary api, if text is shorter 3 words. Otherwise, use translation api
async function translate(req, res) {
  const { langs, text, inDictionary } = req.body;
  try {
    if (text.split(' ').length < 3 && inDictionary) {
      const dictionary = await checkDictionary({ langs, text });
      if (dictionary.length > 0) {
        res.json(dictionary);
      } else {
        const result = await getTranslation({ langs, text });
        res.json(result);
      }

    } else {
      const result = await getTranslation({ langs, text });
      res.json(result);
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
}

async function getSynonyms(word) {
  try {
    const response = await fetch(`https://api.datamuse.com/words?rel_syn=${word}`,
    { method: 'GET' }
    );
    const result = await response.json();
    return { word, syn: result?.map(i => i.word) };
  } catch (err) {
    next(err);
  }
}


//getDictionary()
//handleWords();

//getWordsFromSeries()
//updateDataDB({ sourceId: '7ukNIi1gJmc' }, 'sources');
//mapGetWordsFromSeries()// if it's empty? and there's the same data


module.exports = { mapGetWordsFromSeries, handleWords, getFrequency, translate, checkDictionary, getSynonyms };
