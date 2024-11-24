const Task = require('../models/task');

// Utility function to validate status
const validateStatus = (status) => {
    const validStatuses = ['Pending', 'In Progress', 'Completed'];
    return validStatuses.includes(status);
};

// Create a task
const createTask = async (req, res) => {
    try {
        const { title, description, priority, deadline, status } = req.body;

        // Validate required fields
        if (!title || !description || !priority || !deadline) {
            return res.status(400).json({ message: 'Title, description, priority, and deadline are required' });
        }

        // Validate status
        if (status && !validateStatus(status)) {
            return res.status(400).json({ message: 'Invalid status. Valid statuses are: Pending, In Progress, Completed' });
        }

        const task = await Task.create({
            title,
            description,
            priority,
            deadline,
            status: status || 'Pending', // Default status
            userId: req.user._id, // Attach the userId from JWT
        });

        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating task', error: error.message });
    }
};

// Get all tasks with filtering, searching, and pagination
const getAllTasks = async (req, res) => {
    const { priority, deadline, search, page = 1, limit = 10 } = req.query;

    try {
        let filter = { userId: req.user._id };

        if (priority) {
            filter.priority = priority;
        }

        if (deadline) {
            filter.deadline = { $lte: new Date(deadline) };
        }

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const tasks = await Task.find(filter)
            .skip((page - 1) * limit) // Pagination
            .limit(Number(limit));

        res.status(200).json({ 
            tasks, 
            pagination: { page, limit, total: tasks.length } 
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching tasks', error: err.message });
    }
};

// Get a single task by ID
const getTaskById = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findOne({ _id: id, userId: req.user._id });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ task });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving task', error: err.message });
    }
};

// Update a task by ID
const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, deadline, priority, status } = req.body;

    try {
        // Validate status
        if (status && !validateStatus(status)) {
            return res.status(400).json({ message: 'Invalid status. Valid statuses are: Pending, In Progress, Completed' });
        }

        const task = await Task.findOneAndUpdate(
            { _id: id, userId: req.user._id },
            { title, description, deadline, priority, status },
            { new: true } // Return the updated task
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found or you are not authorized to update it' });
        }

        res.status(200).json({ message: 'Task updated successfully', task });
    } catch (err) {
        res.status(500).json({ message: 'Error updating task', error: err.message });
    }
};

// Delete a task by ID
const deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findOneAndDelete({ _id: id, userId: req.user._id });

        if (!task) {
            return res.status(404).json({ message: 'Task not found or you are not authorized to delete it' });
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting task', error: err.message });
    }
};

module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
};
