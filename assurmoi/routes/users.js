const express = require('express');
const router = express.Router();

const { validateUsername } = require("../middlewares/user");
const { validateAuthentication, authorizeRoles, ROLES } = require("../middlewares/auth");
const { 
    getAllUsers, 
    getUser, 
    createUser, 
    updateUser, 
    deactivateUser 
} = require('../services/users');

router.post('/', validateAuthentication, authorizeRoles(ROLES.ADMIN), validateUsername, createUser);

router.get('/', validateAuthentication, authorizeRoles(ROLES.ADMIN), getAllUsers);

router.get('/:id', validateAuthentication, authorizeRoles(ROLES.ADMIN), getUser);

router.delete('/:id', validateAuthentication, authorizeRoles(ROLES.ADMIN), deactivateUser);

router.put('/:id', validateAuthentication, authorizeRoles(ROLES.ADMIN), updateUser);

module.exports = router;