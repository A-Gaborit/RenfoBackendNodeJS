const { Model, DataTypes } = require('sequelize');

const User = (dbInstance, DataTypes) => {
    class User extends Model {
        clean() {
            const { password, token, refresh_token, two_step_code, ...cleanUser} = this.dataValues;
            return cleanUser;
        }
    }

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
            role: {
                type: DataTypes.ENUM(
                    'admin', 
                    'manager', 
                    'account_manager', 
                    'coordinator', 
                    'policyholder'
                ),
                allowNull: false,
                defaultValue: 'policyholder'
            },
            token: {
                type: DataTypes.STRING,
                allowNull: true
            },
            refresh_token: {
                type: DataTypes.STRING,
                allowNull: true
            },
            two_step_code: {
                type: DataTypes.STRING,
                allowNull: true
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