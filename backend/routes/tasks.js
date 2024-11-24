const express = require('express');
const { auth, checkAdmin } = require('../middlewares/auth');
const { createTask, getTaskById, updateTask, deleteTask } = require('../controllers/taskControllers');

const router = express.Router();

// Protect all task routes with `auth` middleware
router.use(auth);

// Define routes
router.post('/', createTask); // Create a task (only authenticated users)
router.get('/:id', getTaskById); // Fetch a task by ID
router.put('/:id', updateTask); // Update task details
router.delete('/:id', checkAdmin, deleteTask); // Admin only: Delete a task

module.exports = router;
