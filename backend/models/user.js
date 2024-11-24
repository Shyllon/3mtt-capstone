const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required.'],
            trim: true, // Removes unnecessary spaces
            minlength: [6, 'Name must be at least 6 characters long.'],
        },
        email: {
            type: String,
            required: [true, 'Email is required.'],
            unique: true,
            lowercase: true, // Ensures email is stored in lowercase
            match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
        },
        password: {
            type: String,
            required: [true, 'Password is required.'],
            select: true, // Includes the password field in queries by default
        },
    },
    {
        timestamps: true, // Automatically add `createdAt` and `updatedAt`
    }
);

// Pre-save hook to hash the password if it is new or modified
    userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Only hash if the password is new or modified

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt); // Hash the password
        next();
    } catch (error) {
        next(error);
    }
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    console.log('Stored hash:', this.password);
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (err) {
        throw new Error('Error comparing passwords');
    }
};

// Optionally add a static method to find a user by email and password
userSchema.statics.findByCredentials = async function (email, password) {
    const user = await this.findOne({ email }).select('+password'); // Include password in query
    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    return user;
};

module.exports = mongoose.model('User', userSchema);
