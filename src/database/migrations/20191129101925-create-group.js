'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Groups', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING
            },
            description: {
                type: Sequelize.STRING
            },
            fkCreatorUserId: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            isSetteled: {
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
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Groups');
    }
};