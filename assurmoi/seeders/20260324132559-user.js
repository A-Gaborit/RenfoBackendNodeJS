'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('Users', [
      {
        username: 'John Doe',
        password: 'Motdepasse123',
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@gmail.com'
      }
  ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('User', { username: 'John Doe' });
  }
};
