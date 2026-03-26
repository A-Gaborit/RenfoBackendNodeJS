const express = require('express');
const router = express.Router();

const { validateUsername } = require("../middlewares/user");
const { 
    getAllUsers, 
    getUser, 
    createUser, 
    updateUser, 
    deactivateUser 
} = require('../services/users');

router.post('/', validateUsername, createUser);

router.get('/:id', getUser);

router.get('/', getAllUsers);

router.delete('/:id', deactivateUser);

router.put('/:id', updateUser);

module.exports = router;