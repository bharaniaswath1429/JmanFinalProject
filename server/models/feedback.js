const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Feedback = sequelize.define('Feedback', {
  employeeID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  designation:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  managerId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  questions: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  aggregatedScore: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = Feedback;
