const express = require('express');
const router = express.Router();

// Middlewares
const { 
    validateUserRegistration, 
    validateUserLogin,
    validateUserProfileUpdate 
} = require('../middlewares/userValidation');
const { auth, checkAdmin } = require('../middlewares/auth');

// Controllers
const { 
    registerUser, 
    loginUser, 
    getAllUsers, 
    getUserById,
    updateUser, 
    deleteUser 
} = require('../controllers/userControllers');


// Public Routes
router.post('/register', validateUserRegistration, registerUser); // User Registration
router.post('/login', validateUserLogin, loginUser); // User Login (no need for profile validation here)

// Protected Routes (Requires Authentication)
router.get('/', auth, checkAdmin, getAllUsers); // Admin only: Fetch all users
router.get('/:id', auth, getUserById); // Fetch user by ID (only the authenticated user or admin can access)
router.delete('/:id', auth, checkAdmin, deleteUser); // Admin only: Delete a user

// Consolidated Update Route
router.put(
    '/:id',
    auth,
    (req, res, next) => {
        // Conditional validation based on request body
        if (req.body.password) {
            validateUserRegistration(req, res, next); // Validate for password update
        } else {
            validateUserProfileUpdate(req, res, next); // Validate profile updates
        }
    },
    updateUser
);

module.exports = router;
