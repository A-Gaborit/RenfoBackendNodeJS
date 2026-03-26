const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
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
    const { email } = req.body;

    return res.status(200).json({
        message: "Password reset email sent",
        email: email,
        resetToken: "fake-reset-token-67890"
    });
};

const resetPassword = async (req, res) => {
    const { password } = req.body;
    const token = req.headers.authorization;
    
    if (!token || !password) {
        return res.status(400).json({
            message: "Token and new password are required"
        });
    }
    if (token === "Bearer fake-reset-token-67890") {
        return res.status(200).json({
            message: "Password reset successful"
        });
    }
    
    return res.status(401).json({
        message: "Invalid or expired reset token"
    });
};

module.exports = {
    login,
    logout,
    refresh,
    verify2FA,
    forgotPassword,
    resetPassword
};