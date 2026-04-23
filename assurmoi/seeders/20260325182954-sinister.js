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
        driver_engaged_responsability: 50,
        validated: false,
        user_id: 1
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
        driver_engaged_responsability: 0,
        validated: true,
        user_id: 1
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
        driver_engaged_responsability: 100,
        validated: false,
        user_id: 2
      },
      {
        license_plate: 'MN-012-OP',
        driver_firstname: 'Sophie',
        driver_lastname: 'Leroy',
        driver_is_insured: true,
        call_datetime: new Date('2024-01-04T09:30:00Z'),
        sinister_datetime: new Date('2024-01-04T09:15:00Z'),
        context: 'Accident parking',
        driver_responsability: false,
        driver_engaged_responsability: 0,
        validated: true,
        user_id: 2
      },
      {
        license_plate: 'QR-345-ST',
        driver_firstname: 'Thomas',
        driver_lastname: 'Bernard',
        driver_is_insured: true,
        call_datetime: new Date('2024-01-05T11:20:00Z'),
        sinister_datetime: new Date('2024-01-05T11:00:00Z'),
        context: 'Collision arrière sur autoroute',
        driver_responsability: true,
        driver_engaged_responsability: 100,
        validated: false,
        user_id: 2
      },
      {
        license_plate: 'UV-678-WX',
        driver_firstname: 'Camille',
        driver_lastname: 'Petit',
        driver_is_insured: false,
        call_datetime: new Date('2024-01-06T15:45:00Z'),
        sinister_datetime: new Date('2024-01-06T15:30:00Z'),
        context: 'Accident avec piéton',
        driver_responsability: true,
        driver_engaged_responsability: 50,
        validated: true,
        user_id: 2
      },
      {
        license_plate: 'YZ-901-AB',
        driver_firstname: 'Nicolas',
        driver_lastname: 'Rousseau',
        driver_is_insured: true,
        call_datetime: new Date('2024-01-07T08:00:00Z'),
        sinister_datetime: new Date('2024-01-06T22:30:00Z'),
        context: 'Accident nocturne',
        driver_responsability: false,
        driver_engaged_responsability: 0,
        validated: false,
        user_id: 1
      },
      {
        license_plate: 'CD-234-EF',
        driver_firstname: 'Isabelle',
        driver_lastname: 'Moreau',
        driver_is_insured: true,
        call_datetime: new Date('2024-01-08T12:30:00Z'),
        sinister_datetime: new Date('2024-01-08T12:15:00Z'),
        context: 'Glissade sur plaque de verglas',
        driver_responsability: false,
        driver_engaged_responsability: 0,
        validated: true,
        user_id: 1
      },
      {
        license_plate: 'GH-567-IJ',
        driver_firstname: 'François',
        driver_lastname: 'Fournier',
        driver_is_insured: false,
        call_datetime: new Date('2024-01-09T17:00:00Z'),
        sinister_datetime: new Date('2024-01-09T16:45:00Z'),
        context: 'Accident avec véhicule volé',
        driver_responsability: false,
        driver_engaged_responsability: 0,
        validated: false,
        user_id: 1
      },
      {
        license_plate: 'KL-890-MN',
        driver_firstname: 'Émilie',
        driver_lastname: 'Gauthier',
        driver_is_insured: true,
        call_datetime: new Date('2024-01-10T10:15:00Z'),
        sinister_datetime: new Date('2024-01-10T10:00:00Z'),
        context: 'Collision avec animal sauvage',
        driver_responsability: false,
        driver_engaged_responsability: 0,
        validated: true,
        user_id: 1
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Sinisters', null, {});
  }
};
