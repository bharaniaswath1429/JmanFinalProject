const Top_Performers = require('../models/topperformers');

// Get all employee records
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Top_Performers.findAll();
    res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the employee records.' });
  }
};

module.exports = {
  getAllEmployees,
};
