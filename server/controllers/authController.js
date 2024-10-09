const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const signup = async (req, res) => {
  const { name, email, password, employeeID, designation, reportingManager, userType } = req.body;
  
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      employeeID,
      designation,
      reportingManager: reportingManager || "None",
      userType,
    });

    return res.status(201).json({
      message: 'User created successfully',
      user: { name: newUser.name, email: newUser.email, userType: newUser.userType }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create user' });
  }
};

const login = async (req, res) => {
  const { email, password, userType } = req.body;

  try {
    const user = await User.findOne({ where: { email, userType } });
    if (!user) {
      return res.status(400).json({ error: 'User not found or incorrect user type' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect password' });
    }

    const token = jwt.sign(
      { userId: user.id, empId: user.employeeID, email: user.email, role: user.userType, name:user.name},
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log(token)
    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    return res.status(500).json({ error: 'Login failed. Please try again later.' });
  }
};
const employee = async (req, res) => {
  const { empId } = req.query;

  try {
    const user = await User.findOne({ where: { id: empId } });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    return res.status(200).json({ message: 'Found User', user });
  } catch (error) {
    return res.status(500).json({ error: 'Please try again later.' });
  }
};

const getEmployeesByManager = async (req, res) => {
  const { managerId } = req.params;

  try {
    const employees = await User.findAll({
      where: { reportingManager: managerId },
      attributes: ['name', 'employeeID', 'designation'],
    });

    if (employees.length === 0) {
      return res.status(404).json({ message: 'No employees found reporting to this manager' });
    }

    return res.status(200).json({ message: 'Employees found', employees });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Failed to retrieve employees' });
  }
};

const getEmployeesByUserType = async (req, res) => {
  const { userType } = req.params;

  try {
    const employees = await User.findAll({
      where: { userType: userType },
      attributes: ['id','name', 'employeeID', 'designation', 'reportingManager'],
    });

    if (employees.length === 0) {
      return res.status(404).json({ message: 'No employees found reporting to this manager' });
    }

    return res.status(200).json({ message: 'Employees found', employees });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Failed to retrieve employees' });
  }
};


module.exports = { signup, login, employee, getEmployeesByManager, getEmployeesByUserType};