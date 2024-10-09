const { TrainingPerformance, Course } = require('../models');

const submitQuiz = async (req, res) => {
  const { employeeID, name, courseID, answers, time } = req.body;

  console.log(employeeID, name, courseID, answers, time)

  try {
    const course = await Course.findByPk(courseID);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    let score = 0;
    const totalQuestions = course.questions.length;

    course.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        score += 1;
      }
    });

    const finalScore = (score / totalQuestions) * 100;

    const lastPerformance = await TrainingPerformance.findOne({
      where: { employeeID, courseID },
      order: [['attempt', 'DESC']],
    });

    const nextAttempt = lastPerformance ? lastPerformance.attempt + 1 : 1;

    const performance = await TrainingPerformance.create({
      employeeID,
      name,
      courseID,
      course: course.title,
      score: finalScore,
      time,
      attempt: nextAttempt,
    });

    return res.status(201).json({ message: 'Quiz submitted successfully', performance });
  } catch (error) {
    console.log("BA");
    console.log(error)
    return res.status(500).json({ error: 'Failed to submit quiz' });
  }
};

const getEmployeePerformance = async (req, res) => {
  const { employeeID } = req.query;

  try {
    const performanceData = await TrainingPerformance.findAll({
      where: { employeeID },
    });

    return res.status(200).json(performanceData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Failed to fetch performance data' });
  }
};

const getPerformance = async (req, res) => {

  try {
    const performanceData = await TrainingPerformance.findAll();

    return res.status(200).json(performanceData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Failed to fetch performance data' });
  }
};

module.exports = { submitQuiz, getEmployeePerformance, getPerformance};
