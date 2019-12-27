'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('UserExpences', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            amount: {
                type: Sequelize.INTEGER
            },
            fkUserId: {
                type: Sequelize.INTEGER
            },
            fkExpenceId: {
                type: Sequelize.INTEGER
            },
            fkPaidBy: {
                type: Sequelize.INTEGER
            },
            isSetteledUp: {
                type: Sequelize.BOOLEAN
            },
            createdDateTime: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedDateTime: {
                allowNull: false,
                type: Sequelize.DATE
            },
            deletedDateTime: {
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('UserExpences');
    }
};