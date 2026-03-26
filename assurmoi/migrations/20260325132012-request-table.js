'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Requests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      sinister_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Sinisters',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.ENUM(
          'INITIATE',
          'REQUEST_EXPERTISE',          
          'EXPERTISE_PLANNED',
          'EXPERTISE_DONE',
          'REPAIR_PLANNED',
          'REPAIR_DONE',
          'CLOSED'
        ),
        allowNull: false,
      },
      expertise_plan_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      expertise_effective_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      expertise_report_recieved: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      diagnostic: {
        type: Sequelize.ENUM,
        values: ['REPAIRABLE', 'UNREPAIRABLE'],
        allowNull: true,
      },
      diagnostic_report_file: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Documents',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      case1_date_of_service_plan: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      case1_pickup_plan_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      case1_pickup_effective_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      case1_date_of_service_effective: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      case1_end_date_of_service: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      case1_return_date_plan: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      case1_return_date_effective: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      case1_contractor_invoice_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      case1_contractor_invoice: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Documents',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      case1_date_contractor_invoice_paid: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      case1_third_party_invoice_paid: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      case2_estimated_compensation: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      case2_approved_compensation: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      case2_pickup_plan_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      case2_insured_rib: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Documents',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      case2_pickup_effective_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      case2_compensation_payment_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      case2_third_party_invoice_paid: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      closed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Requests');
  }
};
