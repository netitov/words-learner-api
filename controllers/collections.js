const Collection = require('../models/collection');

const { NotFound } = require('../errors');

async function getData(req, res, next) {
  try {
    const response = await Collection.find({});
    if (!response) {
      throw new NotFound('Collections not found');
    } else {
      res.json(response);
    }
  } catch (err) {
    next(err);
  }
};

//remove default state in all collections except selected
async function updateDefaultState(isDefault, userId) {
  if (isDefault) {
    //find object with default value
    const currentDefault = await Collection.findOne({ userId, default: true });
    if (currentDefault) {
      //delete default value of a current object
      await Collection.findByIdAndUpdate(currentDefault._id, { default: false });
    }
  }
}

async function createData(req, res, next) {
  const userId = req.user._id;
  const isDefault = req.body.default;

  try {
    await updateDefaultState(isDefault, userId)

    //create new object
    const collection = await Collection.create({ ...req.body, userId });
    res.json(collection);
  } catch (err) {
    console.log(err);
    next(err);
  }
}


async function deleteData(req, res, next) {
  const { collectionId } = req.params;
  const userId = req.user._id;
  console.log(collectionId, userId)
  try {
    const deletedCollection = await Collection.findOneAndDelete({ _id: collectionId, userId });

    if (!deletedCollection) {
      throw new NotFound('Collection not found');
    } else {
      res.json(deletedCollection);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

async function updateData(req, res, next) {
  try {
    const userId = req.user._id;
    const isDefault = req.body.default;
    await updateDefaultState(isDefault, userId)

    const updatedCollection = await Collection.findByIdAndUpdate(
      req.params.collectionId,
      req.body,
      { new: true }
    );
    if (!updatedCollection) {
      throw new NotFound('Collection not found');
    }
    res.json(updatedCollection);
  } catch (err) {
    next(err);
  }
};


module.exports = {
  getData, createData, deleteData, updateData
};
