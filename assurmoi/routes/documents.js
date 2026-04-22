const express = require('express');
const router = express.Router();

const { validateAuthentication, authorizeRoles, ROLES } = require("../middlewares/auth");

const {
    getAllDocuments,
    getDocument,
    createDocument,
    validateDocument,
    deleteDocument
} = require('../services/documents');

router.get('/', validateAuthentication, authorizeRoles(ROLES.ADMIN, ROLES.MANAGER), getAllDocuments);

router.get('/:id', validateAuthentication, getDocument);

router.post('/', validateAuthentication, createDocument);

router.patch('/:id/validate', validateAuthentication, authorizeRoles(ROLES.ADMIN, ROLES.MANAGER), validateDocument);

router.delete('/:id', validateAuthentication, deleteDocument);

module.exports = router;