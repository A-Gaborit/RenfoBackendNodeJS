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
        sinister_id: 6,
        status: 'REQUEST_EXPERTISE',
        expertise_plan_date: '2026-03-26'
      },
      {
        sinister_id: 4,
        status: 'INITIATE'
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Requests', {}, {});
  }
};
