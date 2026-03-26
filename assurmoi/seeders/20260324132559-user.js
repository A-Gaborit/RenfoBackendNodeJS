'use strict';
const bcrypt = require('bcrypt');
require('dotenv').config();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('MotDeP@sse123', parseInt(process.env.BCRYPT_SALT));
    await queryInterface.bulkInsert('Users', [
      {
        username: 'John Doe',
        password: hashedPassword,
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@gmail.com'
      },
      {
        username: 'AGaborit',
        password: hashedPassword,
        firstname: 'Audrey',
        lastname: 'Gaborit',
        email: 'audrey.gaborit@gmail.com'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('MotDeP@sse123', parseInt(process.env.BCRYPT_SALT));
    await queryInterface.bulkDelete('Users', { password: hashedPassword }, {});
  }
};
