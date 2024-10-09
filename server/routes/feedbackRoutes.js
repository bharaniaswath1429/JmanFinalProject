const express = require('express');
const { createFeedback, getFeedbackByManager, getFeedback } = require('../controllers/feedbackController');
const router = express.Router();

router.post('/', createFeedback);
router.get('/feedback', getFeedback)
router.get('/manager/:managerId', getFeedbackByManager);

module.exports = router;
