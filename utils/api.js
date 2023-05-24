const fetch = require('node-fetch');
const { checkWordInDB, getAllWordsFromDB, addWordToDB, addQueueDB, getQueueWordsDB, updateQueueDB,
  deleteQueueDB } = require('./serverApi');

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

//get word data from dictionary api
async function getWordData(obj) {
  try {
    const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${obj.word}?key=${process.env.WORDS_API_KEY}`)
    const data = await response.json();
    const element = data[0];


    if (element.meta.id === undefined) return
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

async function adaptWords(words) {
  const data = await Promise.all(words.map(async (word) => {
    return await getWordData(word);
  }));
  return data;
}

//get words from series and add to queue
async function getSeries() {

  try {
    const response = await fetch(`https://subtitles-for-youtube2.p.rapidapi.com/subtitles/lrNcx2D_FZI`, {
      headers: {
        'X-RapidAPI-Key': process.env.API_KEY
      }}
    )
    const seriesData = await response.json();
    const filteredWords = filterWords(seriesData);

    //check if word in DB
    //const wordsInDB = await checkWordInDB(filteredWords);
    //const wordsForAdaptation = filteredWords.filter((i) => !wordsInDB.includes(i)).slice(0,800);

    console.log(filteredWords.length);
    //save all words from subs to db. And then remove them after check in words api
    addQueueDB({ sourceId: 'lrNcx2D_FZI', words: filteredWords });

    //query to dictionary if word isn't at DB
    //const data = await adaptWords(wordsForAdaptation);
    //const wordsToDB = data.filter((i) => i !== undefined);

    //save words to DB
    //addWordToDB(wordsToDB);

  } catch (err) {
    console.error(err);
  }
}


//get words from queue, check them in dictionary, save to DB, delete from queue. Count api queries
async function handleWords() {

  //get words from queue
  const allQueue = await getQueueWordsDB();
  const targetQueue = allQueue[0];

  //check if word in DB
  const wordsInDB = await checkWordInDB(targetQueue.words);
  const wordsForAdaptation = targetQueue.words.filter((i) => !wordsInDB.includes(i.word)).slice(0,50);//update amount

  //query to dictionary if word isn't at DB
  //const data = await adaptWords(wordsForAdaptation);
  //const wordsToDB = data.filter((i) => i !== undefined);

  //save words to DB
  //addWordToDB(wordsToDB);

  //clean the queue
  let wordsToRemove = [];
  wordsInDB.forEach((i) => wordsToRemove.push(i));
  wordsForAdaptation.forEach((i) => wordsToRemove.push(i.word));
  const updatedQueue = await updateQueueDB({ sourceId: targetQueue.sourceId, words: wordsToRemove });
  //console.log(updated)

  //delete source from queue
  if (updatedQueue.dataLength < 1) {
    deleteQueueDB({ sourceId: targetQueue.sourceId });
  }

}

handleWords();
//getSeries()

module.exports = { getSeries };
