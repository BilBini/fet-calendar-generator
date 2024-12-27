'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // e.g. a teacher might have many courses, etc.
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.ENUM('admin', 'teacher', 'student')
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      async beforeCreate(user) {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      async beforeUpdate(user) {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });
  return User;
};
