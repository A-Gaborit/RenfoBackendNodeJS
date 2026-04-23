'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Documents', [
      {
        type: 'CNI_DRIVER',
        path: '/documents/cni_driver.pdf',
        validated: true
      },
      {
        type: 'VEHICLE_REGISTRATION',
        path: '/documents/vehicle_registration.pdf',
        validated: false
      },
      {
        type: 'INSURANCE_CERTIFICATE',
        path: '/documents/insurance_certificate.pdf',
        validated: true
      },
      {
        type: 'INSURED_RIB',
        path: '/documents/rib.pdf',
        validated: false
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Documents', {}, {});
  }
};
