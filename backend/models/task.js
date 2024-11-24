const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
    {
        title: { 
            type: String, 
            required: true, 
            trim: true, // Removes leading and trailing whitespace
        },
        description: { 
            type: String, 
            required: false, 
            maxlength: 500, 
            trim: true, // Removes leading and trailing whitespace
        },
        deadline: { 
            type: Date, 
            required: false, 
            validate: {
                validator: function (value) {
                    // Ensure deadline is not in the past
                    return value > new Date();
                },
                message: 'Deadline must be in the future.',
            },
        },
        priority: { 
            type: String, 
            enum: ['low', 'medium', 'high'], 
            default: 'low', 
        },
        status: { 
            type: String, 
            enum: ['Pending', 'In Progress', 'Completed'], 
            default: 'Pending', 
        },
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true,
        },
    },
    { 
        timestamps: true, // Automatically track createdAt and updatedAt
    }
);

// Add a virtual field to format the `deadline` date
taskSchema.virtual('formattedDeadline').get(function () {
    return this.deadline ? this.deadline.toISOString().split('T')[0] : null;
});

// Customize the JSON response of the model
taskSchema.set('toJSON', {
    virtuals: true, // Include virtual fields
    transform: (doc, ret) => {
        delete ret.__v; // Remove the `__v` field
        delete ret._id; // Optionally remove the `_id` field
        ret.id = doc._id; // Replace `_id` with `id` for cleaner API response
    },
});

module.exports = mongoose.model('Task', taskSchema);
