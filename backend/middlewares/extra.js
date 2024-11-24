
// // Secret key should be stored in an environment variable for security purposes
// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Default for local dev, use env var in production

// const auth = async (req, res, next) => {
//     // Extract token from Authorization header
//     const token = req.header('Authorization')?.replace('Bearer ', '');

//     if (!token) {
//         return res.status(401).json({ message: 'No token provided, authorization denied' });
//     }

//     console.log("Extracted Token:", token); // Log token for debugging
    
//     try {
//         // Verify token using the secret key
//         const decoded = jwt.verify(token, JWT_SECRET);
//         console.log("Decoded Token:", decoded); // Log decoded token
        
//         // Find the user by ID from the decoded token
//         const user = await User.findById(decoded.userId);
//         console.log("User Retrieved:", user); // Log user to confirm retrieval
        
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Attach user information to request object for access in later middlewares or routes
//         req.user = user;
//         next();
//     } catch (error) {
//         console.error("Token verification error:", error); // Log error
//         res.status(401).json({ message: 'Invalid or expired token' });
//     }
// };

// // Check if the user is an admin
// const checkAdmin = (req, res, next) => {
//     if (req.user && req.user.role === 'admin') {
//         return next();
//     } else {
//         res.status(403).json({ message: 'Access denied, admin only' });
//     }
// };

// module.exports = { auth, checkAdmin };


// afterAll(async () => {
//    await mongoose.connection.close();
//  });
  