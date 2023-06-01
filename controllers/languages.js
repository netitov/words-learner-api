const Language = require('../models/language');

async function getData(req, res) {
  try {
    const response = await Language.find({});
    return res.json(response);
  } catch (err) {
    console.log(err);
  }
};

async function updateData(data) {
  try {
    const response = await Language.findOneAndUpdate(
      { language: data[1] },
      {
        $set: {
          language: data[1],
          code: data[0]
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

async function updateLanguages(req, res) {
  const data = await Promise.all(Object.entries(req.body.langs).map(async (i) => {
    return await updateData(i);
  }));

  return res.send(data);
}

module.exports = { getData, updateLanguages };
