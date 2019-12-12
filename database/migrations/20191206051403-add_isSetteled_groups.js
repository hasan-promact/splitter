'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.addColumn(
          'Groups',
          'isSetteled',
          Sequelize.BOOLEAN
      );
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.removeColumn(
          'Groups',
          'isSetteled'
      );
  }
};
