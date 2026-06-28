import { Router } from 'express'
import {
  getAllTasks,
  getTaskById,
  getTaskStats,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js'
import {
  createTaskValidation,
  updateTaskValidation,
  listTasksValidation,
} from '../validation/taskSchema.js'
import { validate } from '../middleware/validation.js'

const router = Router()

// Stats must come before /:id to avoid being swallowed by the param route
router.get('/stats', getTaskStats)

router.get('/',    listTasksValidation,  validate, getAllTasks)
router.get('/:id',                               getTaskById)
router.post('/',   createTaskValidation, validate, createTask)
router.put('/:id', updateTaskValidation, validate, updateTask)
router.delete('/:id',                            deleteTask)

export default router
