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
          // Initial states
          'INITIATE',
          'REQUEST_EXPERTISE',
          'EXPERTISE_PLANNED',
          'EXPERTISE_DONE',
          // Scenario 1: Véhicule réparable
          'INTERVENTION_WAITING_PICKUP_SCHEDULE',
          'WAITING_PICKUP_SCHEDULE',
          'PICKUP_PLANNED',
          'INTERVENTION_IN_PROGRESS',
          'RESTITUTION_WAITING_SCHEDULE',
          'RESTITUTION_IN_PROGRESS',
          'INVOICE_WAITING',
          'INVOICE_PAID_WAITING_WARRANTY',
          'CLOSURE_DECISION',
          'INVOICE_THIRD_PARTY_PENDING_CASE1',
          // Scenario 2: Véhicule non réparable
          'VALUATION_SENT',
          'PICKUP_SCHEDULE_WAITING_RIB',
          'PICKUP_PLANNED_CASE2',
          'COMPENSATION_WAITING_PAYMENT',
          'CLOSURE_DECISION_CASE2',
          'INVOICE_THIRD_PARTY_PENDING_CASE2',
          // Final state
          'CLOSED'
        ),
        allowNull: false,
      },
      responsibility: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
