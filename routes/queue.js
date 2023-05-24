const router = require('express').Router();
const queue = require('../controllers/queue');

router.get('/queue', queue.getData);
router.post('/queue', queue.createWords);
router.patch('/queue', queue.updateQueue);
router.delete('/queue', queue.deleteQueue);

module.exports = router;
