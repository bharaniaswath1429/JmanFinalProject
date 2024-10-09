const express = require('express');
const { getAllEmployees } = require('../controllers/topperformersController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/topperformers',authMiddleware, getAllEmployees);

module.exports = router;
