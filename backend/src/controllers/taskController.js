import Task from '../models/Task.js'
import { buildSortQuery, buildFilterQuery, sendSuccess, sendError } from '../utils/helpers.js'

// GET /api/tasks
export async function getAllTasks(req, res, next) {
  try {
    const { status, priority, search, sortBy, order } = req.query

    const filter = buildFilterQuery({ status, priority, search })
    const sort   = buildSortQuery(sortBy, order)

    const tasks = await Task.find(filter).sort(sort).lean()
    sendSuccess(res, { tasks, count: tasks.length })
  } catch (err) {
    next(err)
  }
}

// GET /api/tasks/stats
export async function getTaskStats(req, res, next) {
  try {
    const [statusAgg, priorityAgg, total] = await Promise.all([
      Task.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Task.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
      Task.countDocuments(),
    ])

    const byStatus   = Object.fromEntries(statusAgg.map(({ _id, count }) => [_id, count]))
    const byPriority = Object.fromEntries(priorityAgg.map(({ _id, count }) => [_id, count]))

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    const [overdue, dueToday] = await Promise.all([
      Task.countDocuments({ dueDate: { $lt: today }, status: { $ne: 'completed' } }),
      Task.countDocuments({ dueDate: { $gte: today, $lt: tomorrow }, status: { $ne: 'completed' } }),
    ])

    sendSuccess(res, {
      total,
      todo:         byStatus.todo         || 0,
      inProgress:   byStatus['in-progress'] || 0,
      completed:    byStatus.completed    || 0,
      highPriority: byPriority.high       || 0,
      byStatus,
      byPriority,
      overdue,
      dueToday,
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/tasks/:id
export async function getTaskById(req, res, next) {
  try {
    const task = await Task.findById(req.params.id).lean()
    if (!task) return sendError(res, 'Task not found', 404)
    sendSuccess(res, { task })
  } catch (err) {
    next(err)
  }
}

// POST /api/tasks
export async function createTask(req, res, next) {
  try {
    const { title, description, status, priority, dueDate, tags } = req.body
    const task = await Task.create({ title, description, status, priority, dueDate, tags })
    sendSuccess(res, { task }, 201)
  } catch (err) {
    next(err)
  }
}

// PUT /api/tasks/:id
export async function updateTask(req, res, next) {
  try {
    const { title, description, status, priority, dueDate, tags } = req.body

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, priority, dueDate, tags },
      { new: true, runValidators: true, lean: true },
    )

    if (!task) return sendError(res, 'Task not found', 404)
    sendSuccess(res, { task })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/tasks/:id
export async function deleteTask(req, res, next) {
  try {
    const task = await Task.findByIdAndDelete(req.params.id).lean()
    if (!task) return sendError(res, 'Task not found', 404)
    sendSuccess(res, { message: 'Task deleted successfully' })
  } catch (err) {
    next(err)
  }
}
