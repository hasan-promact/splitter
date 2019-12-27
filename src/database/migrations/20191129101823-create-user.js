'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
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
    email: {        
        type: Sequelize.STRING,
        allowNull: false
    },
    phone: {
        type: Sequelize.BIGINT
    },
	password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    isRegistrationCompleted: {
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
    return queryInterface.dropTable('Users');
  }
};