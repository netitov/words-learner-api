const UserWord = require('../models/userWord');

const { NotFound } = require('../errors');

async function getData(req, res, next) {
  const userId = req.user._id;
  try {
    const response = await UserWord.find({ userId });
    if (!response) {
      throw new NotFound('There is no user with this id');
    } else {
      res.json(response);
    }
  } catch (err) {
    next(err);
  }
};

async function createData(req, res, next) {
  const words = req.body;
  const userId = req.user._id;
  const addedWords = [];

  try {
    for (let i = 0; i < words.length; i++) {
      const wordObj = words[i];
      const addedWord = await UserWord.create({ ...wordObj, results: [], userId });
      addedWords.push(addedWord);
    }

    res.json(addedWords);
  } catch (err) {
    console.log(err);
    next(err);
  }
}

async function deleteData(req, res, next) {
  const { word } = req.params;
  const userId = req.user._id;
  try {
    const deletedWord = await UserWord.findOneAndDelete({ word, userId });

    if (!deletedWord) {
      throw new NotFound('Word not found');
    } else {
      res.json({ message: 'Word deleted successfully' });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//remove deleted collection from user words
async function updateWordSource(req, res, next) {
  try {
    const { collectionId } = req.body;
    const userId = req.user._id;

    //update words collection
    await UserWord.updateMany(
      { 'source.collectionId': collectionId, userId: userId },
      { $pull: { source: { collectionId } } }
    );

    //get and return all user words
    const allWords = await UserWord.find({ userId });
    res.json(allWords);

  } catch (err) {
    console.log(err);
    next(err);
  }
}

//remove words array from user learning list
async function deleteArrayData(req, res, next) {
  try {
    const { collectionId } = req.body;
    const userId = req.user._id;

    // Delete words
    await UserWord.deleteMany({ 'source.collectionId': collectionId, userId });

    //get and return all user words
    const allWords = await UserWord.find({ userId });
    res.json(allWords);

  } catch (err) {
    console.log(err);
    next(err);
  }
}

async function addTestResult(req, res, next) {
  try {
    const { wordId, value, testId } = req.body;

    const updatedWord = await UserWord.findByIdAndUpdate(
      wordId,
      {
        $push: { results: { value, testId } }
      },
      { new: true }
    );

    if (updatedWord) {
      res.json(updatedWord);
    } else {
      throw new NotFound('Word not found');
    }
  } catch (err) {
    next(err);
  }
}




module.exports = {
  getData, createData, deleteData, updateWordSource, deleteArrayData, addTestResult
};
