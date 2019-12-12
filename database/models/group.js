'use strict';
module.exports = (sequelize, DataTypes) => {
    const Group = sequelize.define('Group', {
        name: {
            field: 'name',
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    args: true,
                    msg: 'Name is required'
                },
                len: {
                    args: [2, 50],
                    msg: 'Name must be between 2 and 10 characters'
                }
            }
        },
        description: DataTypes.STRING,
        fkCreatorUserId: {
            type: DataTypes.INTEGER
        },
        isSetteled: {
            field: 'isSetteled',
            type: DataTypes.BOOLEAN
        }
    },
        {
            createdAt: 'createdDateTime',
            updatedAt: 'updatedDateTime',
            deletedAt: 'deletedDateTime',
            paranoid: true
        });
    Group.associate = function (models) {
        Group.belongsToMany(models.User, {
            through: models.UserGroup,
            as: 'users',
            foreignKey: 'fkGroupId',
            timestamps: false
        });
        Group.hasMany(models.Expence, {
            as: 'expence',
            foreignKey: 'fkGroupId'
        });

    };
    return Group;
};