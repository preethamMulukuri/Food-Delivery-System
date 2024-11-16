// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateUser = async (req, res, next) => {
    // const token = req.header('Authorization')?.replace('Bearer ', '');
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided. Authorization denied.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // req.user = decoded; // Assuming the decoded token contains the user ID
        req.user = { userId: decoded.userId };
        // console.log("Token auth is done Middleware.js");
        // console.log(decoded);
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid.' });
    }
};

module.exports = authenticateUser;
