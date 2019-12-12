'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Expences', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            amount: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            description: {
                type: Sequelize.STRING
            },
            fkGroupId: {
                type: Sequelize.INTEGER
            },
            fkPaidBy: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            fkCreatedBy: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            isSetteledUp: {
                allowNull: false,
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
        return queryInterface.dropTable('Expences');
    }
};