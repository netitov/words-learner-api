const router = require('express').Router();
const { errors } = require('celebrate');

const apicallsRoute = require('./apicalls');
const authRoute = require('./auth');
const dictRoute = require('./dictionary');
const freqRoute = require('./freqs');
const langRoute = require('./languages');
const queueRoute = require('./queue');
const sourcesRoute = require('./sources');
const translateRoute = require('./translate');
const wordsDataRoute = require('./wordData');
const wordsRoute = require('./words');
const usersRoute = require('./users');
const userWordsRoute = require('./userWords');
const collectionsRouter = require('./collections');
const { NotFound } = require('../errors')
const authMiddleware = require('../middlewares/auth');

router.use('/apicalls', apicallsRoute);
router.use('/', authRoute);
router.use('/dictionary', dictRoute);
router.use('/freq', freqRoute);
router.use('/languages', langRoute);
router.use('/queue', queueRoute);
router.use('/sources', sourcesRoute);
router.use('/translate', translateRoute);
router.use('/', wordsDataRoute);
router.use('/words', wordsRoute);
router.use('/users', usersRoute);
router.use('/userwords', userWordsRoute);
router.use('/collections', collectionsRouter);

router.use('*', authMiddleware, () => {
  throw new NotFound('Page not found');
});


module.exports = router;
