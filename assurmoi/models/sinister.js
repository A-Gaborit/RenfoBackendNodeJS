const { Model, DataTypes } = require('sequelize');
const { dbInstance } = require('.');

const Sinister = (dbInstance, DataTypes) => {
  class Sinister extends Model {
    static associate(models) {
      Sinister.hasMany(models.Request, {
        foreignKey: 'sinister_id',
        as: 'Request',
      });

      Sinister.hasMany(models.History, {
        foreignKey: 'sinister_id',
        as: 'History',
      });

      Sinister.belongsTo(models.Document, {
        foreignKey: 'cni_driver',
        as: 'cniDriver',
      });

      Sinister.belongsTo(models.Document, {
        foreignKey: 'vehicle_registration_certificate',
        as: 'vehicleRegistrationCertificate',
      });

      Sinister.belongsTo(models.Document, {
        foreignKey: 'insurance_certificate',
        as: 'insuranceCertificate',
      });

      Sinister.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'User',
      });
    }
  }

  Sinister.init(
    {
      license_plate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      driver_firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      driver_lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      driver_is_insured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      call_datetime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      sinister_datetime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      context: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      driver_responsability: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      driver_engaged_responsability: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cni_driver: DataTypes.INTEGER,
      vehicle_registration_certificate: DataTypes.INTEGER,
      insurance_certificate: DataTypes.INTEGER,
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      validated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize: dbInstance,
      modelName: 'Sinister',
      timestamps: false,
    }
  );

  return Sinister;
};

module.exports = Sinister;