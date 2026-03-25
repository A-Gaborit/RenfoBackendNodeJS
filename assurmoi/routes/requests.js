const express = require('express');
const router = express.Router();

const { 
    getAllRequests, 
    getRequest, 
    createRequest, 
    updateRequest 
} = require('../services/requests');

router.get('/', getAllRequests);

router.get('/:id', getRequest);

router.post('/', createRequest);

router.put('/:id', updateRequest);

module.exports = router;