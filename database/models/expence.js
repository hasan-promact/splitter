'use strict';
module.exports = (sequelize, DataTypes) => {
    const Expence = sequelize.define('Expence', {
        amount: {
            field: 'amount',
            type: DataTypes.INTEGER,
            validate: {
                notEmpty: {
                    args: true,
                    msg: 'Amount is required'
                },
                isNumeric: {
                    args: true,
                    msg: 'Amount must only contain numbers'
                }
            }
        },
        description: DataTypes.STRING,
        fkGroupId: DataTypes.INTEGER,
        fkPaidBy: DataTypes.INTEGER,
        fkCreatedBy: DataTypes.INTEGER,
        isSetteledUp: DataTypes.BOOLEAN
    }, {
            createdAt: 'createdDateTime',
            updatedAt: 'updatedDateTime',
            deletedAt: 'deletedDateTime',
            paranoid: true
        });
    Expence.associate = function (models) {
        Expence.belongsTo(models.User, {
            as: 'payee',
            foreignKey: 'fkPaidBy'
        });
        Expence.belongsTo(models.User, {
            as: 'owner',
            foreignKey: 'fkCreatedBy'
        });
        Expence.belongsTo(models.Group, {
            as: 'group',
            foreignKey: 'fkGroupId'
        });
    };
    return Expence;
};