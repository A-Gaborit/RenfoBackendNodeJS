'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Sinisters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      license_plate: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      driver_firstname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      driver_lastname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      driver_is_insured: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      call_datetime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      sinister_datetime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      context: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      driver_responsability: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      driver_engaged_responsability: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      cni_driver: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Documents',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      vehicle_registration_certificate: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Documents',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      insurance_certificate: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Documents',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      validated: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Sinisters');
  }
};
