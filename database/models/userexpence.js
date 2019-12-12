'use strict';
module.exports = (sequelize, DataTypes) => {
    const UserExpence = sequelize.define('UserExpence', {
        amount: DataTypes.INTEGER,
        fkUserId: DataTypes.INTEGER,
        fkExpenceId: DataTypes.INTEGER,
        fkPaidBy: DataTypes.INTEGER,
        isSetteledUp: DataTypes.BOOLEAN
    }, {
            createdAt: 'createdDateTime',
            updatedAt: 'updatedDateTime',
            deletedAt: 'deletedDateTime',
            paranoid: true
        });
    UserExpence.associate = function (models) {
        UserExpence.belongsTo(models.User, {
            as: 'payee',
            foreignKey: 'fkPaidBy'
        });
        UserExpence.belongsTo(models.User, {
            as: 'oweby',
            foreignKey: 'fkUserId'
        });
        UserExpence.belongsTo(models.Expence, {
            as: 'expence',
            foreignKey: 'fkExpenceId'
        });
    };
    return UserExpence;
};