const express = require('express');
const {getAllRecords} = require('../controllers/retainedController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/retained',authMiddleware, getAllRecords);

module.exports = router;
