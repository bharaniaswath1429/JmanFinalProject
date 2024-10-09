const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const TrainingPerformance = sequelize.define('TrainingPerformance', {
  employeeID: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  courseID: { type: DataTypes.INTEGER, allowNull: false },
  course: { type: DataTypes.STRING, allowNull: false },
  score: { type: DataTypes.FLOAT, allowNull: false },
  time: { type: DataTypes.FLOAT, allowNull: false },
  attempt: { type: DataTypes.INTEGER, allowNull: false },
}, { timestamps: true });

module.exports = TrainingPerformance;
