'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
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
        email: {
            field: 'email',
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    args: true,
                    msg: 'email is required'
                },
                isEmail: {
                    args: true,
                    msg: 'Email address is not proper'
                }
            }
        },
        phone: {
            field: 'phone',
            type: DataTypes.BIGINT,
            validate: {
                notEmpty: {
                    args: true,
                    msg: 'Phone number is required'
                },
                isNumeric: {
                    args: true,
                    msg: 'Phone number must only contain numbers'
                },
                len: {
                    args: [10, 10],
                    msg: 'Phone number must have 10 characters'
                }
            }
        },
        isRegistrationCompleted: {
            field: 'isRegistrationCompleted',
            type: DataTypes.BOOLEAN
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: {
                args: true,
                msg: 'Password is required'
            }
        }
    }, {
            createdAt: 'createdDateTime',
            updatedAt: 'updatedDateTime',
            deletedAt: 'deletedDateTime',
            paranoid: true,
            indexes: [{ unique: true, fields: ['email'] }]
        });
    User.associate = function (models) {
        User.belongsToMany(models.Group, {
            through: models.UserGroup,
            as: 'groups',
            foreignKey: 'fkUserId',
            timestamps: false
        });
        User.belongsToMany(models.User, {
            through: models.UserContact,
            as: 'friends',
            foreignKey: 'fkContactId',
            timestamps: false
        });
        User.belongsToMany(models.User, {
            through: models.UserContact,
            as: 'contacts',
            foreignKey: 'fkUserId', 
            timestamps: false
        });
        User.hasMany(models.UserExpence, {
            as: 'expences',
            foreignKey: 'fkUserId', 
        });
        User.hasMany(models.UserExpence, {
            as: 'lent',
            foreignKey: 'fkPaidBy', 
        });
    };
    return User;
};