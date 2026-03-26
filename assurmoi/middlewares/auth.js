const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const validateAuthentication = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    
    if (!authorizationHeader) return res.status(401).json({ message: 'No authorization header provided' });
    
    const token = authorizationHeader.split(' ')[1];

    if(!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });

        // user is logout
        const user = await User.findOne({ where: { token } });
        if(!user) return res.status(403).json({ message: 'Session expired' });

        // verify token expiration
        if (Date.now() >= decoded.exp * 1000) {
            user.token = null;
            user.save();
            return res.status(403).json({ message: 'Token expired' });
        }
        
        req.user = user;
        next();
    });
}

module.exports = {
    validateAuthentication
}