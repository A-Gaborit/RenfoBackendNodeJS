const { Model, DataTypes } = require('sequelize');

const History = (dbInstance, DataTypes) => {
  class History extends Model {
    static associate(models) {
      History.belongsTo(models.Request, {
        foreignKey: 'request_id',
        as: 'Request',
      });

      History.belongsTo(models.Sinister, {
        foreignKey: 'sinister_id',
        as: 'Sinister',
      });

      History.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'User',
      });
    }
  }

  History.init(
    {
      request_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      sinister_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      update_details: {
        type: DataTypes.TEXT,
        allowNull: true,
      }
    },
    {
      sequelize: dbInstance,
      modelName: 'History',
      updatedAt: false,
    }
  );
  return History;
};

module.exports = History;