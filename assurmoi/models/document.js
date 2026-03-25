const { Model, DataTypes } = require('sequelize');

const Document = (dbInstance, DataTypes) => {
    class Document extends Model {}

    Document.init(
        {
            type: {
                type: DataTypes.ENUM('CNI_DRIVER', 'VEHICLE_REGISTRATION', 'INSURANCE_CERTIFICATE', 'DIAGNOSIS_REPORT', 'CONTRACTOR_INVOICE', 'INSURED_RIB'),
                allowNull: false,
            },
            path: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            validated: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            sequelize: dbInstance,
            modelName: 'Document',
            timestamps: false
        }
    )
    return Document;
};

module.exports = Document;