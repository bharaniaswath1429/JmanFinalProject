const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Course = sequelize.define('Course', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  questions: {
    type: DataTypes.JSONB, 
    allowNull: false,
  },
  startCourseDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  courseExpireDate: {
    type: DataTypes.DATE,
    allowNull: false,
  }
});

module.exports = Course;

