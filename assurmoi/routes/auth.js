const express = require('express');
const router = express.Router();

const { validateAuthentication } = require("../middlewares/auth");

const {
    login,
    refresh,
    logout,
    verify2FA,
    forgotPassword,
    resetPassword
} = require('../services/auth');

router.post('/login', login);

router.post('/refresh', validateAuthentication, refresh);

router.post('/logout', validateAuthentication, logout);

router.post('/2fa/verify', verify2FA);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);

module.exports = router;