const { body, validationResult } = require('express-validator');

// Validation Middleware for Task
const validateTask = [
    body('title').notEmpty().withMessage('Title is required'),
    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string'),
    body('deadline')
        .optional()
        .isISO8601()
        .toDate()
        .withMessage('Deadline must be a valid date'),
    body('priority')
        .optional()
        .isIn(['Low', 'Medium', 'High'])
        .withMessage("Priority must be one of 'Low', 'Medium', or 'High'"),
    body('status')
        .optional()
        .isIn(['Pending', 'Completed'])
        .withMessage("Status must be either 'Pending' or 'Completed'"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

module.exports = { validateTask };