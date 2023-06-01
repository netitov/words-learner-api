const Sources = require('../models/source');

async function getData(req, res) {
  try {
    const response = await Sources.find({ added: false });
    res.json(response);
  } catch (err) {
    console.log(err);
  }
};

//insert only of not exists
async function createData(req) {
  try {
    const response = await Sources.findOneAndUpdate(
      { id: req.id },
      { $setOnInsert: {
          id: req.id,
          title: req.title,
          group: req.group,
          added: false
        }
      },
      { upsert: true }
    );
    return response;
  } catch (err) {
    console.log(err);
  }
};

async function updateData(data, res) {
  try {
    const response = await Sources.findOneAndUpdate(
      { id: data.body.id },
      { added: true }
    );
  } catch (err) {
    console.log(err);
  }
};

async function createDataList(req, res) {
  const data = await Promise.all(req.body.map(async (i) => {
    return await createData(i);
  }));
  return res.send(data);
}

module.exports = { getData, createDataList, updateData };
