const { checkSchema, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    return res.status(400).json({
        message: "Validation failed",
        errors: errors.array()
    });
};

const validateLogin = [
    checkSchema({
        email: {
            notEmpty: { errorMessage: "L'email est requis" },
            isEmail: { errorMessage: "L'email doit être valide" }
        },
        password: {
            notEmpty: { errorMessage: "Le mot de passe est requis" }
        }
    }),
    handleValidationErrors
];

const validateForgotPassword = [
    checkSchema({
        email: {
            notEmpty: { errorMessage: "L'email est requis" },
            isEmail: { errorMessage: "L'email doit être valide" }
        }
    }),
    handleValidationErrors
];

const validateResetPassword = [
    checkSchema({
        token: {
            notEmpty: { errorMessage: "Le token est requis" }
        },
        password: {
            notEmpty: { errorMessage: "Le mot de passe est requis" },
            isLength: {
                options: { min: 6 },
                errorMessage: "Le mot de passe doit contenir au moins 6 caractères"
            }
        }
    }),
    handleValidationErrors
];

const validateCreateSinister = [
    checkSchema({
        license_plate: {
            notEmpty: { errorMessage: "La plaque d'immatriculation est requise" }
        },
        driver_firstname: {
            notEmpty: { errorMessage: "Le prénom du conducteur est requis" }
        },
        driver_lastname: {
            notEmpty: { errorMessage: "Le nom du conducteur est requis" }
        },
        driver_is_insured: {
            notEmpty: { errorMessage: "Le statut d'assurance est requis" },
            isBoolean: { errorMessage: "driver_is_insured doit être un booléen" }
        },
        call_datetime: {
            notEmpty: { errorMessage: "La date d'appel est requise" },
            isISO8601: { errorMessage: "La date d'appel doit être une date valide" }
        },
        sinister_datetime: {
            notEmpty: { errorMessage: "La date du sinistre est requise" },
            isISO8601: { errorMessage: "La date du sinistre doit être une date valide" }
        },
        driver_responsability: {
            notEmpty: { errorMessage: "La responsabilité est requise" },
            isBoolean: { errorMessage: "driver_responsability doit être un booléen" }
        },
        driver_engaged_responsability: {
            notEmpty: { errorMessage: "Le niveau de responsabilité engagée est requis" },
            isInt: {
                options: { min: 0, max: 100 },
                errorMessage: "Le niveau de responsabilité doit être entre 0 et 100"
            }
        }
    }),
    handleValidationErrors
];

const validateUpdateSinister = [
    checkSchema({
        license_plate: {
            optional: true,
            notEmpty: { errorMessage: "La plaque d'immatriculation ne peut pas être vide" }
        },
        driver_firstname: {
            optional: true,
            notEmpty: { errorMessage: "Le prénom du conducteur ne peut pas être vide" }
        },
        driver_lastname: {
            optional: true,
            notEmpty: { errorMessage: "Le nom du conducteur ne peut pas être vide" }
        },
        driver_is_insured: {
            optional: true,
            isBoolean: { errorMessage: "driver_is_insured doit être un booléen" }
        },
        call_datetime: {
            optional: true,
            isISO8601: { errorMessage: "La date d'appel doit être une date valide" }
        },
        sinister_datetime: {
            optional: true,
            isISO8601: { errorMessage: "La date du sinistre doit être une date valide" }
        },
        driver_responsability: {
            optional: true,
            isBoolean: { errorMessage: "driver_responsability doit être un booléen" }
        },
        driver_engaged_responsability: {
            optional: true,
            isInt: {
                options: { min: 0, max: 100 },
                errorMessage: "Le niveau de responsabilité doit être entre 0 et 100"
            }
        }
    }),
    handleValidationErrors
];


const validateUpdateRequest = [
    checkSchema({
        sinister_id: {
            optional: true,
            isInt: { errorMessage: "L'ID du sinistre doit être un nombre entier" }
        },
        status: {
            optional: true,
            isIn: {
                options: [[
                    'INITIATE', 'REQUEST_EXPERTISE', 'EXPERTISE_PLANNED', 'EXPERTISE_DONE',
                    'INTERVENTION_WAITING_PICKUP_SCHEDULE', 'WAITING_PICKUP_SCHEDULE', 'PICKUP_PLANNED',
                    'INTERVENTION_IN_PROGRESS', 'RESTITUTION_WAITING_SCHEDULE', 'RESTITUTION_IN_PROGRESS',
                    'INVOICE_WAITING', 'INVOICE_PAID_WAITING_WARRANTY', 'CLOSURE_DECISION',
                    'INVOICE_THIRD_PARTY_PENDING_CASE1', 'VALUATION_SENT', 'PICKUP_SCHEDULE_WAITING_RIB',
                    'PICKUP_PLANNED_CASE2', 'COMPENSATION_WAITING_PAYMENT', 'CLOSURE_DECISION_CASE2',
                    'INVOICE_THIRD_PARTY_PENDING_CASE2', 'CLOSED'
                ]],
                errorMessage: "Statut invalide"
            }
        },
        responsibility: {
            optional: true,
            isInt: {
                options: { min: 0, max: 100 },
                errorMessage: "La responsabilité doit être entre 0 et 100"
            }
        },
        diagnostic: {
            optional: true,
            isIn: {
                options: [['REPAIRABLE', 'UNREPAIRABLE']],
                errorMessage: "Le diagnostic doit être REPAIRABLE ou UNREPAIRABLE"
            }
        }
    }),
    handleValidationErrors
];

const validateUpdateUser = [
    checkSchema({
        username: {
            optional: true,
            notEmpty: { errorMessage: "Le nom d'utilisateur ne peut pas être vide" }
        },
        firstname: {
            optional: true,
            notEmpty: { errorMessage: "Le prénom ne peut pas être vide" }
        },
        lastname: {
            optional: true,
            notEmpty: { errorMessage: "Le nom ne peut pas être vide" }
        },
        email: {
            optional: true,
            isEmail: { errorMessage: "L'email doit être valide" }
        },
        password: {
            optional: true,
            isLength: {
                options: { min: 6 },
                errorMessage: "Le mot de passe doit contenir au moins 6 caractères"
            }
        }
    }),
    handleValidationErrors
];

module.exports = {
    validateLogin,
    validateForgotPassword,
    validateResetPassword,
    validateCreateSinister,
    validateUpdateSinister,
    validateUpdateRequest,
    validateUpdateUser,
    handleValidationErrors
};
