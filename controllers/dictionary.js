const Dictionary = require('../models/dictionary');

async function getData(req, res) {
  try {
    const response = await Dictionary.find({});
    return res.json(response);
  } catch (err) {
    console.log(err);
  }
};

async function updateData(data) {
  try {
    const response = await Dictionary.findOneAndUpdate(
      { languages: data },
      {
        $set: {
          languages: data
        }
      },
      { upsert: true }
    );
    if (response) return response;
    else return;
  } catch (err) {
    console.log(err);
  }
};

async function updateDictionary(req, res) {
  const data = await Promise.all(req.body.map(async (i) => {
    return await updateData(i);
  }));

  return res.send(data);
}

module.exports = { getData, updateDictionary };
