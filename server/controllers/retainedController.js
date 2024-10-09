const Retained_Employees = require('../models/retained');

const getAllRecords = async (req, res) => {
  try {
    const records = await Retained_Employees.findAll();
    res.status(200).json(records);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'An error occurred while fetching the records.' });
  }
};

module.exports = {getAllRecords};