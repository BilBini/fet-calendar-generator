'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    static associate(models) {
      // Belongs to a student (User)
      Attendance.belongsTo(models.User, { foreignKey: 'student_id' });
      // Belongs to a Course
      Attendance.belongsTo(models.Course, { foreignKey: 'course_id' });
    }
  }
  Attendance.init({
    student_id: DataTypes.INTEGER,
    course_id: DataTypes.INTEGER,
    date: DataTypes.DATEONLY,
    status: DataTypes.ENUM('present', 'absent', 'late'),
  }, {
    sequelize,
    modelName: 'Attendance',
  });
  return Attendance;
};
