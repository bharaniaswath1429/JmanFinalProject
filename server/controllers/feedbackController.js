const Feedback = require('../models/feedback');

const calculateAggregateScore = (questions) => {
  const totalScore = questions.reduce((acc, score) => acc + score, 0);
  const maxScore = questions.length * 5;
  return (totalScore / maxScore) * 100;
};


const createFeedback = async (req, res) => {
  try {
    const { employeeID, name, managerId, designation, questions } = req.body.feedback;

    if (!employeeID || !managerId || !questions || !name || !designation || questions.length === 0) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    const aggregatedScore = calculateAggregateScore(questions);

    const feedback = await Feedback.create({
      employeeID,
      name,
      designation,
      managerId,
      questions,
      aggregatedScore,
    });
    
    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback,
    });
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all feedback by managerId
const getFeedbackByManager = async (req, res) => {
  try {
    const {managerId} = req.params;
    const feedbacks = await Feedback.findAll({
      where: { managerId },
    });

    if (!feedbacks.length) {
      return res.status(404).json({ message: 'No feedbacks found' });
    }

    res.status(200).json({ feedbacks });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ message: 'Internal server error' , error});
  }
};

const getFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll();

    if (!feedbacks.length) {
      return res.status(404).json({ message: 'No feedbacks found' });
    }

    res.status(200).json({ feedbacks });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ message: 'Internal server error' , error});
  }
};

module.exports = {createFeedback, getFeedbackByManager, getFeedback};
