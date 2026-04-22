const { Model, DataTypes } = require('sequelize');

const Request = (dbInstance, DataTypes) => {
  class Request extends Model {
    static associate(models) {
      Request.belongsTo(models.Sinister, {
        foreignKey: 'sinister_id',
        as: 'Sinister',
      });

      Request.belongsTo(models.Document, {
        foreignKey: 'diagnostic_report_file',
        as: 'diagnosticReportFile',
      });

      Request.belongsTo(models.Document, {
        foreignKey: 'case1_contractor_invoice',
        as: 'case1ContractorInvoice',
      });

      Request.belongsTo(models.Document, {
        foreignKey: 'case2_insured_rib',
        as: 'case2InsuredRib',
      });
    }
  }

  Request.init(
    {
      sinister_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
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
          'CLOSED'
        ),
        allowNull: false,
      },
      responsibility: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
          max: 100
        }
      },
      expertise_plan_date: DataTypes.DATE,
      expertise_effective_date: DataTypes.DATE,
      expertise_report_recieved: DataTypes.DATE,

      diagnostic: {
        type: DataTypes.ENUM('REPAIRABLE', 'UNREPAIRABLE'),
        allowNull: true,
      },
      diagnostic_report_file: DataTypes.INTEGER,
      case1_date_of_service_plan: DataTypes.DATE,
      case1_pickup_plan_date: DataTypes.DATE,
      case1_pickup_effective_date: DataTypes.DATE,
      case1_date_of_service_effective: DataTypes.DATE,
      case1_end_date_of_service: DataTypes.DATE,
      case1_return_date_plan: DataTypes.DATE,
      case1_return_date_effective: DataTypes.DATE,
      case1_contractor_invoice_date: DataTypes.DATE,
      case1_contractor_invoice: DataTypes.INTEGER,
      case1_date_contractor_invoice_paid: DataTypes.DATE,
      case1_third_party_invoice_paid: DataTypes.BOOLEAN,
      case2_estimated_compensation: DataTypes.FLOAT,
      case2_approved_compensation: DataTypes.BOOLEAN,
      case2_pickup_plan_date: DataTypes.DATE,
      case2_insured_rib: DataTypes.INTEGER,
      case2_pickup_effective_date: DataTypes.DATE,
      case2_compensation_payment_date: DataTypes.DATE,
      case2_third_party_invoice_paid: DataTypes.BOOLEAN,
      closed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize: dbInstance,
      modelName: 'Request',
      timestamps: false,
    }
  );

  return Request;
};

module.exports = Request;