const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Retained_Employees = sequelize.define('Retained_Employees', {
  score: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  id: {
    type: DataTypes.TEXT,
    allowNull: false,
    primaryKey: true
  },
  aggregatedScore: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  Final_score: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  Retained: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'Retained_Employees',
  timestamps: false,
});

module.exports = Retained_Employees;
