const fetch = require('node-fetch');

function filterWords(arr) {
  const newArr = [];
  arr.forEach((i) => {
    i.text.split(' ').forEach((j) => {
      if (!newArr.includes(j) && isNaN(Number(j)) && !j.includes("'") && !j.includes('[') && !j.includes(']')) {
        newArr.push(j);
      }
    })
  })
  return newArr;
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
  const file = data.hwi.prs.find((i) => i.sound).sound.audio;
  const subdirectory = file.substring(0, 1);
  return `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdirectory}/${file}.mp3`;
}

async function getWordData(word) {
  try {
    const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${process.env.WORDS_API_KEY}`)
    const data = await response.json();
    const element = data[0];

    if (element.meta.id === undefined) return;

    return {
      word: getWord(element),
      fl: element.fl,
      audio: getAudio(element)
    }
  } catch (err) {
    console.error(err);
  }
}

async function adaptWords(words) {
  const data = await Promise.all(words.map(async (word) => {
    debugger
    return await getWordData(word);
  }))
}

//get words from series
async function getSeries() {
  try {
    const response = await fetch(`https://subtitles-for-youtube2.p.rapidapi.com/subtitles/l6vAubuhoYw`, {
      headers: {
        'X-RapidAPI-Key': process.env.API_KEY
      }}
    )
    const seriesData = await response.json();
    const nextData = filterWords(seriesData);
    adaptWords(nextData.slice(0, 3));
    //save to DB

  } catch (err) {
    console.error(err);
  }
}

module.exports = { getSeries };

//getMainActorProfileFromMovie(1).then((profile) => {console.log(profile)});
