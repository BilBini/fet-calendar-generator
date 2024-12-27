'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    static associate(models) {
      Class.belongsTo(models.Department, { foreignKey: 'department_id' });
      Class.hasMany(models.Course, { foreignKey: 'class_id' });
      Class.hasMany(models.Timetable, { foreignKey: 'class_id' });
    }
  }
  Class.init({
    name: DataTypes.STRING,
    department_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Class',
  });
  return Class;
};
