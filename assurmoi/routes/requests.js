const express = require('express');
const router = express.Router();

const { 
    getAllRequests, 
    getRequest, 
    createRequest, 
    updateRequest,
    transitionRequest 
} = require('../services/requests');

router.get('/', getAllRequests);

router.get('/:id', getRequest);

router.post('/', createRequest);

router.put('/:id', updateRequest);

router.patch('/:id/transition', transitionRequest);

module.exports = router;