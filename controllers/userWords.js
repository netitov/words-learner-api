const UserWord = require('../models/userWord');

const { NotFound } = require('../errors');

async function getData(req, res, next) {
  const userId = req.user._id;
  try {
    const response = await UserWord.find({ userId });
    if (!response) {
      throw new NotFound('There is no user with this id');
    }
    res.json(response);
  } catch (err) {
    next(err);
  }
};

async function createData(req, res, next) {
  const words = req.body;
  const userId = req.user._id;
  try {
    for (let i = 0; i < words.length; i++) {
      const wordObj = words[i];
      await UserWord.create({ ...wordObj, userId });
    }
    res.json('Added to learning list');
  } catch (err) {
    console.log(err);
    next(err);
  }
}

module.exports = {
  getData, createData
};
