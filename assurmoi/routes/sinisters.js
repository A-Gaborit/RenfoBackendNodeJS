const express = require('express');
const router = express.Router();

const {
    getAllSinisters,
    getSinister,
    createSinister,
    updateSinister,
    validateSinister
} = require('../services/sinisters');

router.get('/', getAllSinisters);

router.get('/:id', getSinister);

router.post('/', createSinister);

router.put('/:id', updateSinister);

router.patch('/:id/validate', validateSinister)

module.exports = router;