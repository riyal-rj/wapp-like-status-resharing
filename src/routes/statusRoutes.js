const express = require('express');
const router = express.Router();
const StatusController = require('../controllers/statusController');

router.post('/postStatus', StatusController.postStatus);

router.get('/checkStatus/:userId', StatusController.checkStatus);

router.post('/reshareStatus', StatusController.reshareStatus);

router.post('/deleteStatus', StatusController.deleteStatus);

router.get('/viewers/:userId', StatusController.getViewers);

module.exports = router;