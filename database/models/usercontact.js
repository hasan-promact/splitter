'use strict';
module.exports = (sequelize, DataTypes) => {
    const UserContact = sequelize.define('UserContact', {
        fkUserId: DataTypes.INTEGER,
        fkContactId: DataTypes.INTEGER
    }, { timestamps: false });
    UserContact.associate = function (models) {
        // associations can be defined here
    };
    return UserContact;
};