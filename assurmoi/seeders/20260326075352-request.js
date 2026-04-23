'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Requests', [
      {
        sinister_id: 1,
        status: 'INITIATE'
      },
      {
        sinister_id: 2,
        status: 'REQUEST_EXPERTISE'
      },
      {
        sinister_id: 3,
        status: 'INITIATE'
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Requests', {}, {});
  }
};
