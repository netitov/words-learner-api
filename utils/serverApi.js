const fetch = require('node-fetch');
const { SERVER_API } = require('./config');

async function checkWordInDB(req) {
  try {
    const response = await fetch(`${SERVER_API}/words`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

async function getAllWordsFromDB() {
  try {
    const response = await fetch(`${SERVER_API}/wordsdata`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

async function addWordToDB(req) {
  try {
    const response = await fetch(`${SERVER_API}/words`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

async function addQueueDB(req) {
  try {
    const response = await fetch(`${SERVER_API}/queue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    debugger
    const data = await response;
    console.log(data)
    return data;
  } catch (err) {
    console.error(err);
  }
}

async function updateQueueDB(req) {
  try {
    const response = await fetch(`${SERVER_API}/queue`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

async function getQueueWordsDB() {
  try {
    const response = await fetch(`${SERVER_API}/queue`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

async function deleteQueueDB(req) {
  try {
    const response = await fetch(`${SERVER_API}/queue`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

module.exports = { checkWordInDB, getAllWordsFromDB, addWordToDB, addQueueDB, updateQueueDB, getQueueWordsDB, deleteQueueDB };
