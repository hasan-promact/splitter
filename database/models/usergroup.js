'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserGroup = sequelize.define('UserGroup', {
    fkUserId: DataTypes.INTEGER,
    fkGroupId: DataTypes.INTEGER
  }, {timestamps: false });
  UserGroup.associate = function(models) {
    // associations can be defined here
  };
  return UserGroup;
};