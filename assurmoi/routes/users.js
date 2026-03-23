const express = require('express');
const { validateUsername } = require("../middlewares/user");
const router = express.Router();

router.post('/', validateUsername, (req, res) => {
    const user = req.body;
    res.status(201).json({
        user
    });
});

router.get('/:id', (req, res) => {
    res.status(200).json({
        user: req.params.id
    });
});

module.exports = router;