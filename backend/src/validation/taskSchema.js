import { body, query } from 'express-validator'
import { TASK_STATUS, TASK_PRIORITY } from '../utils/constants.js'

export const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters')
    .isLength({ max: 100 }).withMessage('Title must be under 100 characters'),

  body('description')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 500 }).withMessage('Description must be under 500 characters'),

  body('status')
    .optional()
    .isIn(TASK_STATUS).withMessage(`Status must be one of: ${TASK_STATUS.join(', ')}`),

  body('priority')
    .optional()
    .isIn(TASK_PRIORITY).withMessage(`Priority must be one of: ${TASK_PRIORITY.join(', ')}`),

  body('dueDate')
    .optional({ nullable: true })
    .custom((val) => {
      if (val === null || val === '') return true
      if (isNaN(Date.parse(val))) throw new Error('Invalid due date')
      return true
    }),

  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),

  body('tags.*')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 30 }).withMessage('Each tag must be under 30 characters'),
]

export const updateTaskValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters')
    .isLength({ max: 100 }).withMessage('Title must be under 100 characters'),

  body('description')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 500 }).withMessage('Description must be under 500 characters'),

  body('status')
    .optional()
    .isIn(TASK_STATUS).withMessage(`Status must be one of: ${TASK_STATUS.join(', ')}`),

  body('priority')
    .optional()
    .isIn(TASK_PRIORITY).withMessage(`Priority must be one of: ${TASK_PRIORITY.join(', ')}`),

  body('dueDate')
    .optional({ nullable: true })
    .custom((val) => {
      if (val === null || val === '') return true
      if (isNaN(Date.parse(val))) throw new Error('Invalid due date')
      return true
    }),

  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
]

export const listTasksValidation = [
  query('status')
    .optional()
    .isIn([...TASK_STATUS, '']).withMessage('Invalid status filter'),

  query('priority')
    .optional()
    .isIn([...TASK_PRIORITY, '']).withMessage('Invalid priority filter'),

  query('sortBy').optional().isString(),
  query('order').optional().isIn(['asc', 'desc', '']),
  query('search').optional().isString(),
]
