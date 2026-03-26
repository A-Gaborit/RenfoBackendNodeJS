const { Model, DataTypes } = require('sequelize');

const User = (dbInstance, DataTypes) => {
    class User extends Model {}

    User.init(
        {
            username: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            firstname: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            lastname: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING(50),
                allowNull: false,
            }, 
            active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
        },
        {
            sequelize: dbInstance,
            modelName: 'User',
            timestamps: false
        }
    )
    return User;
};

module.exports = User;