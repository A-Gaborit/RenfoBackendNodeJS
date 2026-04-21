const express = require('express');
const router = express.Router();

const { validateAuthentication, authorizeRoles, ROLES } = require("../middlewares/auth");

const { 
    getAllRequests, 
    getRequest, 
    createRequest, 
    updateRequest,
    transitionRequest 
} = require('../services/requests');

router.get('/', validateAuthentication, authorizeRoles(ROLES.ADMIN, ROLES.MANAGER, ROLES.COORDINATOR, ROLES.POLICYHOLDER), getAllRequests);

router.get('/:id', validateAuthentication, authorizeRoles(ROLES.ADMIN, ROLES.MANAGER, ROLES.COORDINATOR, ROLES.POLICYHOLDER), getRequest);

// router.post('/', validateAuthentication, createRequest);

router.put('/:id', validateAuthentication, authorizeRoles(ROLES.ADMIN, ROLES.MANAGER, ROLES.COORDINATOR), updateRequest);

router.patch('/:id/transition', validateAuthentication, authorizeRoles(ROLES.ADMIN, ROLES.MANAGER, ROLES.COORDINATOR), transitionRequest);

module.exports = router;