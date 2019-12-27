'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('UserContact', {
            fkUserId: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            fkContactId: {
                allowNull: false,
                type: Sequelize.INTEGER
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('UserContact');
    }
};
