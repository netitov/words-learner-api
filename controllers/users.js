const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user');
const Token = require('../models/token');
const { SERVER_API } = require('../utils/config');
const { sendEmail } = require('../utils/sendEmail');
const { resetPassText } = require('../utils/constants');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');


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
    console.log(req.user)
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

    res.send({ token, userName, email });
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
        const token = createToken(user._id);
      res.send({ token, email: user.email, userName: user.userName });
    } else {
      throw new Unauthorized('Incorrect email or password');
    }
  } catch (err) {
    next(err);
    console.log(err);
  }
};

const sendResetLink = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Unauthorized("user with given email doesn't exist");
    }

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString('hex'),
      }).save();
    }

    // path to email template
    const rootDir = path.resolve(__dirname, '..');
    const templatePath = path.join(rootDir, 'utils', 'emailTemplate.hbs');

    //get html template for email
    const emailTemplateSource = fs.readFileSync(templatePath, 'utf8');
    const emailTemplate = handlebars.compile(emailTemplateSource);

    const link = `${SERVER_API}/password-reset/${user._id}/${token.token}`;
    const text = resetPassText(link);
    const htmlToSend = emailTemplate({ link: link });
    await sendEmail(user.email, 'Password reset', text, htmlToSend);

    res.json('password reset link sent to your email account');

  } catch (err) {
    next(err);
    console.log(err);
  }

}


module.exports = {
  createUser, updateUser, login, getUserMe, sendResetLink
};
