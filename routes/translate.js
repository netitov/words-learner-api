const router = require('express').Router();
const { translate } = require('../utils/api');

router.post('/', translate);

module.exports = router;
