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

async function getDataFromDB(route) {
  debugger
  try {
    const response = await fetch(`${SERVER_API}/${route}`, {
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

async function addDataDB(req, route) {
  try {
    const response = await fetch(`${SERVER_API}/${route}`, {
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

async function updateDataDB(req, route) {
  try {
    const response = await fetch(`${SERVER_API}/${route}`, {
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

async function updateApiCallsDB(req) {
  try {
    const response = await fetch(`${SERVER_API}/apicalls`, {
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

async function updateLanguagesDB(req) {
  try {
    const response = await fetch(`${SERVER_API}/languages`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    const data = await response.json();
    console.log('doen Sertver Api')
    return data;
  } catch (err) {
    console.error(err);
  }
}

async function updateDictionaryDB(req) {
  try {
    const response = await fetch(`${SERVER_API}/dictionary`, {
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


module.exports = {
  checkWordInDB,
  getDataFromDB,
  addWordToDB,
  addDataDB,
  updateDataDB,
  getQueueWordsDB,
  deleteQueueDB,
  updateApiCallsDB,
  updateLanguagesDB,
  updateDictionaryDB
};
