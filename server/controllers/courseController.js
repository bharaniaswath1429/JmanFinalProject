const { Course } = require('../models');

const createCourse = async (req, res) => {
  const { title, duration, designation, description, questions, startCourseDate, courseExpireDate } = req.body;
  
  try {
    const course = await Course.create({ 
      title, duration, designation, description, questions, startCourseDate, courseExpireDate 
    });
    return res.status(201).json({ message: 'Course created', course });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create course' });
  }
};


const getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

const getCoursesByDesignation = async (req, res) => {
  const { designation } = req.query;

  try {
    const courses = designation
      ? await Course.findAll({ where: { designation } })
      : await Course.findAll();

    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch courses by designation' });
  }
};

const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, duration, designation, description, questions, startCourseDate, courseExpireDate } = req.body;

  try {
    const course = await Course.findByPk(id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    await course.update({ title, duration, designation, description, questions, startCourseDate, courseExpireDate });
    return res.status(200).json({ message: 'Course updated', course });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update course' });
  }
};


const deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findByPk(id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    await course.destroy();
    return res.status(200).json({ message: 'Course deleted' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete course' });
  }
};

const getOneCourse = async (req, res) => {
  const { id } = req.params;
  console.log(id)
  try {
    const course = await Course.findByPk(id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    return res.status(200).json({ message: 'Course found' , course});
  } catch (error) {
    return res.status(500).json({ error: 'Failed to find course' });
  }
};

module.exports = { createCourse, getCourses, updateCourse, deleteCourse, getCoursesByDesignation, getOneCourse };
