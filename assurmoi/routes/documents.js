const express = require('express');
const router = express.Router();

const {
    getAllDocuments,
    getDocument,
    createDocument,
    deleteDocument
} = require('../services/documents');

router.get('/', getAllDocuments)

router.get('/:id', getDocument)

router.post('/', createDocument)

router.delete('/:id', deleteDocument)

module.exports = router;