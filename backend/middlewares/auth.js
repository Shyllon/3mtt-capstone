const jwt = require('jsonwebtoken');
require('dotenv').config();  // Ensure dotenv is configured to load environment variables

const auth = async (req, res, next) => {
    try {
        // Extract the token from Authorization header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'No token provided, authorization denied' });
        }

        // Verify the token using the JWT secret from the .env file
        const secret = process.env.JWT_SECRET; // Dynamically fetch secret from .env
        const decoded = jwt.verify(token, secret);

        // Find the user associated with the token
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Attach user to the request object and proceed
        req.user = user;
        next();
        } catch (error) {
        console.error("Error during token validation:", error.message);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // Verify token with JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Store decoded data (user info) in the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

// Check if the user is an admin
const checkAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    } else {
        res.status(403).json({ message: 'Access denied, admin only' });
    }
};

module.exports = { auth, checkAdmin, verifyToken };
