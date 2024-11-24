const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

// Registration Controller
const bcrypt = require('bcryptjs');
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    // Validation for required fields
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required" });
    }

    try {
        // Check if the user already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        console.log('Plaintext password:', password); // Only log the plaintext password for debugging

        // Create a new user; password hashing will be handled by the Mongoose model
        const newUser = new User({
            name,
            email,
            password, // Pass plaintext password; hashing occurs in the model's pre-save hook
        });

        await newUser.save(); // Save the user to the database

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//login controller
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if the password matches (assuming you use bcrypt for hashing)
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email }, // Payload data
            process.env.JWT_SECRET, // Signing secret from environment variable
            { expiresIn: '1h' } // Token expiration
        );

        // Send response with the token
        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get All Users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
};

// Get user profile route
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId); // Get user using the decoded userId from the token
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user); // Send user data as the response
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Error fetching profile' });
    }
};

// Get User by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user', error: err.message });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    try {
        const updateFields = { name, email };
        
        // If password is provided, hash it before updating
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateFields.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateFields,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

// Delete User
const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: `User ${deletedUser.name} deleted successfully` });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
