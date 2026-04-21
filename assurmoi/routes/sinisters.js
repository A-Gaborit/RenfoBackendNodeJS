const express = require('express');
const router = express.Router();

const { validateAuthentication, authorizeRoles, ROLES } = require("../middlewares/auth");

const {
    getAllSinisters,
    getSinister,
    createSinister,
    updateSinister,
    validateSinister
} = require('../services/sinisters');


router.get('/', validateAuthentication, authorizeRoles(ROLES.ADMIN, ROLES.MANAGER, ROLES.ACCOUNT_MANAGER), getAllSinisters);

router.get('/:id', validateAuthentication,authorizeRoles(ROLES.ADMIN, ROLES.MANAGER, ROLES.ACCOUNT_MANAGER), getSinister);

router.post('/', validateAuthentication, authorizeRoles(ROLES.ADMIN, ROLES.MANAGER, ROLES.ACCOUNT_MANAGER), createSinister);

router.put('/:id', validateAuthentication, authorizeRoles(ROLES.ADMIN, ROLES.MANAGER, ROLES.ACCOUNT_MANAGER), updateSinister);

router.patch('/:id/validate', validateAuthentication, authorizeRoles(ROLES.ADMIN, ROLES.MANAGER, ROLES.ACCOUNT_MANAGER), validateSinister);

module.exports = router;