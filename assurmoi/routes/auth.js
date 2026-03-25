const express = require('express');
const router = express.Router();

const {
    login,
    refresh,
    verify2FA,
    forgotPassword,
    resetPassword
} = require('../services/auth');

router.post('/login', login);

router.post('/refresh', refresh)

router.post('/2fa/verify', verify2FA);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);

module.exports = router;