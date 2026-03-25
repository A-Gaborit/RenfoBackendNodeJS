'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Sinisters', [
      {
        license_plate: 'AB-123-CD',
        driver_firstname: 'Jean',
        driver_lastname: 'Dupont',
        driver_is_insured: true,
        call_datetime: new Date('2024-01-01T10:00:00Z'),
        sinister_datetime: new Date('2024-01-01T09:30:00Z'),
        context: 'Accident sur la rocade',
        driver_responsability: true,
        driver_engaged_responsability: 0,
        validated: false
      },
      {
        license_plate: 'EF-456-GH',
        driver_firstname: 'Marie',
        driver_lastname: 'Martin',
        driver_is_insured: true,
        call_datetime: new Date('2024-01-02T14:00:00Z'),
        sinister_datetime: new Date('2024-01-02T13:45:00Z'),
        context: 'Collision à un carrefour',
        driver_responsability: false,
        driver_engaged_responsability: 50,
        validated: true
      },
      {
        license_plate: 'IJ-789-KL',
        driver_firstname: 'Pierre',
        driver_lastname: 'Durand',
        driver_is_insured: false,
        call_datetime: new Date('2024-01-03T16:00:00Z'),
        sinister_datetime: new Date('2024-01-03T15:30:00Z'),
        context: 'Sortie de route',
        driver_responsability: true,
        driver_engaged_responsability: 0,
        validated: false
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Sinisters', null, {});
  }
};
