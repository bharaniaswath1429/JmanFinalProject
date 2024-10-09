const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Top_performers = sequelize.define('Top_Performers', {
  score: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0,
  },
  time: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0,
  },
  employeeID: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  designation: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'top_performing_employees',
  timestamps: false,
});

module.exports = Top_performers;
