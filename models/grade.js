'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Grade extends Model {
    static associate(models) {
      // Belongs to a student (User)
      Grade.belongsTo(models.User, { foreignKey: 'student_id' });
      // Belongs to a Course
      Grade.belongsTo(models.Course, { foreignKey: 'course_id' });
    }
  }
  Grade.init({
    student_id: DataTypes.INTEGER,
    course_id: DataTypes.INTEGER,
    grade: DataTypes.FLOAT,   // or DataTypes.STRING for letter grades
    note: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Grade',
  });
  return Grade;
};
