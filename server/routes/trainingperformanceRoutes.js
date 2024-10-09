const express = require('express');
const { submitQuiz, getEmployeePerformance, getPerformance } = require('../controllers/trainingperformanceController');
const router = express.Router();

router.post('/submit-quiz', submitQuiz);
router.get('/employee-performance', getEmployeePerformance);
router.get('/performance', getPerformance)

module.exports = router;
