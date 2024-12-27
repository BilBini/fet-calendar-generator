'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      Course.belongsTo(models.User, { foreignKey: 'teacher_id' });
      Course.belongsTo(models.Class, { foreignKey: 'class_id' });
      Course.hasMany(models.Timetable, { foreignKey: 'course_id' });
    }
  }
  Course.init({
    name: DataTypes.STRING,
    teacher_id: DataTypes.INTEGER,
    class_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};

