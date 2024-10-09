const express = require('express');
const { createCourse, getCourses, updateCourse, deleteCourse, getOneCourse, getCoursesByDesignation } = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/courses', authMiddleware, createCourse);
router.get('/allcourses', authMiddleware, getCourses);
router.get('/courses', authMiddleware, getCoursesByDesignation);
router.delete('/courses/:id', authMiddleware, deleteCourse);
router.get('/courses/:id', authMiddleware, getOneCourse);
router.put('/courses/:id', authMiddleware, updateCourse);

module.exports = router;
