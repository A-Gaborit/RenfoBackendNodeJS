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