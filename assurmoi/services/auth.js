const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { mailLogin, mailPasswordReset } = require('../utils/mailer');
require('dotenv').config();

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ 
            where: { email: email } 
        });
        
        // En production, renvoyer le même message pour éviter de divulguer des informations
        if (!user) return res.status(401).json({ message: "User not found" });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({message: "Incorrect password"});
        
        const token = jwt.sign({user: user.clean()}, process.env.JWT_SECRET, { expiresIn: '1h' });

        user.token = token;
        user.save();

        const mailStatus = await mailLogin(user);
        if (mailStatus !== true) console.error("Login notification email failed to send");
        
        return res.status(200).json({
            token: token,
            user: user.clean()
        });
    } catch (err) {
        return res.status(400).json({
            message: "Error connection",
            stacktrace: err.errors
        });
    }
};

const refresh = async(req, res) => {
    try {
        const newToken = jwt.sign({ 
            id: req.user.id, 
            email: req.user.email 
        }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        req.user.token = newToken;
        req.user.save();
        
        return res.status(200).json({
            message: "Token refreshed successfully",
            token: newToken,
            user: req.user.clean()
        });
        
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

const logout = async (req, res) => {
    try {
        req.user.token = null;
        req.user.save();
        
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        return res.status(401).json({ message: "Logout failed" });
    }
};

const verify2FA = async (req, res) => {    
    const token = req.headers.authorization;
    
    if (!token) {
        return res.status(400).json({
            message: "Token is required"
        });
    }
    
    if (token === "fake-jwt-token-12345") {
        return res.status(200).json({
            message: "Token valid",
            user: {
                id: 1,
                username: "testuser",
                email: "test@example.com"
            }
        });
    }
    
    return res.status(401).json({
        message: "Invalid token"
    });
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(200).json({ message: "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé." });

        const resetToken = jwt.sign(
            { userId: user.id, email: user.email, type: 'password-reset' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        user.refresh_token = resetToken;
        await user.save();

        const mailStatus = await mailPasswordReset(user, resetToken);
        if (mailStatus !== true) console.error("Password reset email failed to send:", mailStatus);

        return res.status(200).json({
            message: "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé."
        });
    } catch (error) {
        return res.status(500).json({
            message: "Une erreur est survenue lors de la demande de réinitialisation."
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ message: "Token invalide ou expiré" });
        }

        if (decoded.type !== 'password-reset') {
            return res.status(401).json({ message: "Token invalide" });
        }

        const user = await User.findOne({
            where: {
                id: decoded.userId,
                refresh_token: token
            }
        });

        if (!user) return res.status(401).json({ message: "Token invalide ou déjà utilisé" });

        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT) || 10);

        user.password = hashedPassword;
        user.refresh_token = null;
        await user.save();

        return res.status(200).json({
            message: "Votre mot de passe a été réinitialisé avec succès"
        });
    } catch (error) {
        console.error("Reset password error:", error);
        return res.status(500).json({
            message: "Une erreur est survenue lors de la réinitialisation du mot de passe"
        });
    }
};

module.exports = {
    login,
    logout,
    refresh,
    verify2FA,
    forgotPassword,
    resetPassword
};