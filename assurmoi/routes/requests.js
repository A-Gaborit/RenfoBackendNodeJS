const express = require('express');
const router = express.Router();

const { validateAuthentication, authorizeRoles, ROLES } = require("../middlewares/auth");

const { 
    getAllRequests, 
    getRequest, 
    updateRequest,
    transitionRequest,
    getRequestTransitions
} = require('../services/requests');

router.get('/', validateAuthentication, authorizeRoles(ROLES.ADMIN, ROLES.MANAGER, ROLES.COORDINATOR, ROLES.POLICYHOLDER), getAllRequests);

router.get('/:id', validateAuthentication, authorizeRoles(ROLES.ADMIN, ROLES.MANAGER, ROLES.COORDINATOR, ROLES.POLICYHOLDER), getRequest);

router.get('/:id/transitions', validateAuthentication, authorizeRoles(ROLES.ADMIN, ROLES.MANAGER, ROLES.COORDINATOR, ROLES.POLICYHOLDER), getRequestTransitions);

router.put('/:id', validateAuthentication, authorizeRoles(ROLES.ADMIN, ROLES.MANAGER, ROLES.COORDINATOR), updateRequest);

router.patch('/:id/transition', validateAuthentication, authorizeRoles(ROLES.ADMIN, ROLES.MANAGER, ROLES.COORDINATOR), transitionRequest);

module.exports = router;