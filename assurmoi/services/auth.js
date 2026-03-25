const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (email === "test@test.fr") {
            return res.status(200).json({
                message: "Login successful",
                token: "fake-jwt-token-12345",
                user: {
                    id: 1,
                    email: email,
                    password: password
                }
            });
        } else {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }
    } catch (err) {
        return res.status(400).json({
            message: "Error connection",
            stacktrace: err.errors
        });
    }
};

const refresh = async(req, res) => {
    const token = req.headers.authorization;
    
    if (!token) {
        return res.status(400).json({
            message: "Token is required"
        });
    }
    
    if (token === "Bearer fake-jwt-token-12345") {
        return res.status(200).json({
            message: "Token refreshed successfully",
            token: "Bearer fake-jwt-token-new-54321",
            user: {
                id: 1,
                username: "testuser",
                email: "test@example.com"
            }
        });
    }
    
    return res.status(401).json({
        message: "Invalid or expired token"
    });
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

    console.log(token)
    
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
    refresh,
    verify2FA,
    forgotPassword,
    resetPassword
};