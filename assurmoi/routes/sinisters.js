const express = require('express');
const router = express.Router();

const { validateAuthentication, authorizeRoles, ROLES } = require("../middlewares/auth");
const { validateCreateSinister, validateUpdateSinister } = require("../middlewares/validation");

const {
    getAllSinisters,
    getSinister,
    createSinister,
    updateSinister,
    validateSinister,
    setSinisterDocument,
    getFile
} = require('../services/sinisters');


router.get('/', validateAuthentication, authorizeRoles(ROLES.ADMIN, ROLES.MANAGER, ROLES.ACCOUNT_MANAGER, ROLES.POLICYHOLDER), getAllSinisters);

router.get('/:id', validateAuthentication,authorizeRoles(ROLES.ADMIN, ROLES.MANAGER, ROLES.ACCOUNT_MANAGER, ROLES.POLICYHOLDER), getSinister);

router.post('/', validateAuthentication, authorizeRoles(ROLES.ADMIN, ROLES.MANAGER, ROLES.ACCOUNT_MANAGER), validateCreateSinister, createSinister);

router.put('/:id', validateAuthentication, authorizeRoles(ROLES.ADMIN, ROLES.MANAGER, ROLES.ACCOUNT_MANAGER), validateUpdateSinister, updateSinister);

router.patch('/:id/validate', validateAuthentication, authorizeRoles(ROLES.ADMIN, ROLES.MANAGER), validateSinister);

router.post('/:id/document', validateAuthentication, setSinisterDocument);

router.get('/download-docs/:pathname', validateAuthentication, getFile);

module.exports = router;