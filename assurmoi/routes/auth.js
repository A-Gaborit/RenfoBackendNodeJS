const express = require('express');
const router = express.Router();

const { validateAuthentication } = require("../middlewares/auth");
const { validateLogin, validateForgotPassword, validateResetPassword } = require("../middlewares/validation");

const {
    login,
    refresh,
    logout,
    verify2FA,
    forgotPassword,
    resetPassword
} = require('../services/auth');

router.post('/login', validateLogin, login);

router.post('/refresh', validateAuthentication, refresh);

router.post('/logout', validateAuthentication, logout);

router.post('/2fa/verify', verify2FA);

router.post('/forgot-password', validateForgotPassword, forgotPassword);

router.post('/reset-password', validateResetPassword, resetPassword);

module.exports = router;