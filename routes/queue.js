const router = require('express').Router();
const queue = require('../controllers/queue');

router.get('/', queue.getData);
router.post('/', queue.createWords);
router.patch('/', queue.updateQueue);
router.delete('/', queue.deleteQueue);

module.exports = router;
