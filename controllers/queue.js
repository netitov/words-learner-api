const Queue = require('../models/queue');

async function getData(req, res) {
  try {
    const response = await Queue.find({}).lean();
    return res.json(response);
  } catch (err) {
    console.log(err);
  }
};

async function createWords(data) {
  debugger
  try {
    const response = await Queue.create(data.body);
    if (response) return response;
    else return;
  } catch (err) {
    console.log(err);
  }
};

async function deleteQueue(data) {
  try {
    const response = await Queue.deleteOne(data.body);
    if (response) return response;
    else return;
  } catch (err) {
    console.log(err);
  }
};

async function updateWord(sourceId, data) {

  try {
    const response = await Queue.findOneAndUpdate(
      { sourceId: sourceId },
      {
        $pull: {
          words: {
            word: data,
          }
        }
      },
      { new: true }
    );
    if (response) return response.words;
    else return;
  } catch (err) {
    console.log(err);
  }
};

async function updateQueue(req, res) {
  const data = await Promise.all(req.body.words.map(async (word) => {
    return await updateWord(req.body.sourceId, word);
  }));

  const dataLength = data.length === 0 ? 0 : data.sort((a,b) => a.length - b.length)[0].length;
  return res.send({ dataLength });
}

module.exports = { getData, createWords, updateQueue, deleteQueue };
