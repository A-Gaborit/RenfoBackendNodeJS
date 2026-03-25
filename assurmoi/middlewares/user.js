const { checkSchema, validationResult } = require('express-validator');

async function validateUsername(req, res, next) {
    await checkSchema({
        username: {
            notEmpty: {
                errorMessage: "Le nom d'utilisateur est requis"
            }
        },
        password: {
            notEmpty: {
                errorMessage: "Le mot de passe est requis"
            }
        },
        email: {
            notEmpty: {
                errorMessage: "L'email est requis"
            }
        }
    }).run(req);
    
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    res.status(400).json({ 
        message: "Missing required fields",
        errors: errors.array()
    });
}

module.exports = {
    validateUsername
};