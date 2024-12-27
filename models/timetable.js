'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Timetable extends Model {
    static associate(models) {
      Timetable.belongsTo(models.Class, { foreignKey: 'class_id' });
      Timetable.belongsTo(models.Course, { foreignKey: 'course_id' });
    }
  }
  Timetable.init({
    class_id: DataTypes.INTEGER,
    course_id: DataTypes.INTEGER,
    day: DataTypes.ENUM('Monday','Tuesday','Wednesday','Thursday','Friday'),
    start_time: DataTypes.TIME,
    end_time: DataTypes.TIME
  }, {
    sequelize,
    modelName: 'Timetable',
  });
  return Timetable;
};
