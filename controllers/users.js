const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  NotFound, Conflict, Unauthorized, BadRequest,
} = require('../errors');

const { NODE_ENV, JWT_SECRET } = process.env;

const createToken = (userId) => {
  return jwt.sign({ _id: userId },
    NODE_ENV === 'production' ? JWT_SECRET : 'development',
    { expiresIn: '7d' });
};

const getUserMe = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFound('There is no user with this id');
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const {
      userName, email, password,
    } = req.body;

    const createdAt = new Date();

    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      throw new Conflict('User with this email already exists');
    }

    const existingUserName = await User.findOne({ userName });
    if (existingUserName) {
      throw new Conflict('User with this username already exists');
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email, password: hash, userName, createdAt
    });

    const token = createToken(newUser._id);

    res.send({ token });
  } catch (err) {
    if (err.name === 'ValidationError') {
      throw new BadRequest('Incorrect data entered');
    }
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { email, userName } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { email, userName },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedUser) {
      throw new NotFound('There is no user with this id');
    }
    res.send(updatedUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      throw new BadRequest('Incorrect data entered');
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Unauthorized('Incorrect email or password');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      /* const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'development',
        { expiresIn: '7d' }); */
        //createToken(user._id)
        const token = createToken(user._id);
      res.send({ token });
    } else {
      throw new Unauthorized('Incorrect email or password');
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser, updateUser, login, getUserMe,
};
