const ApiCalls = require('../models/apicall');

async function getData(req, res) {
  try {
    const response = await ApiCalls.find({}).lean();
    return res.json(response);
  } catch (err) {
    console.log(err);
  }
};

async function updateData(data) {
  try {
    const response = await ApiCalls.findOneAndUpdate(
      { date: data.body.date },
      { $inc: { words: data.body.words },
        $set: {
          date: data.body.date,
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


module.exports = { getData, updateData};
