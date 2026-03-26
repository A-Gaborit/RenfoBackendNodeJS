const express = require('express');
const router = express.Router();

const {
    getAllDocuments,
    getDocument,
    createDocument,
    validateDocument,
    deleteDocument
} = require('../services/documents');

router.get('/', getAllDocuments)

router.get('/:id', getDocument)

router.post('/', createDocument)

router.patch('/:id/validate', validateDocument)

router.delete('/:id', deleteDocument)

module.exports = router;