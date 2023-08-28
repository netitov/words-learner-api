const TestResult = require('../models/testResult');
const UserWord = require('../models/userWord');
const { NotFound } = require('../errors');

async function getData(req, res, next) {
  try {
    const response = await TestResult.find({});
    if (!response) {
      throw new NotFound('Tests results not found');
    } else {
      res.json(response);
    }
  } catch (err) {
    next(err);
  }
};

async function createData(req, res, next) {

  try {
    const userId = req.user._id;
    //save test result in Test model
    const quizResult = await TestResult.create({ userId });
    res.json(quizResult);

  } catch (err) {
    console.log(err);
    next(err);
  }
}

async function deleteData(req, res, next) {
  const { testId } = req.params;
  const userId = req.user._id;
  console.log(testId, userId)
  try {
    const deletedTest = await Collection.findOneAndDelete({ _id: testId, userId });

    if (!deletedTest) {
      throw new NotFound('Test not found');
    } else {
      res.json(deletedTest);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = {
  getData, createData, deleteData
};
