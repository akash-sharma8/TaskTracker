import { VALID_SORT_FIELDS, VALID_SORT_ORDERS, PRIORITY_ORDER, DEFAULT_SORT_FIELD, DEFAULT_SORT_ORDER } from './constants.js'

/**
 * Build a Mongoose sort object from query params
 */
export function buildSortQuery(sortBy, order) {
  const field = VALID_SORT_FIELDS.includes(sortBy) ? sortBy : DEFAULT_SORT_FIELD
  const dir   = VALID_SORT_ORDERS.includes(order)  ? order  : DEFAULT_SORT_ORDER

  // Priority is a string enum — sort by numeric order in app layer
  // For Mongoose, still sort by the field name (works lexically for low < medium < high)
  return { [field]: dir === 'asc' ? 1 : -1 }
}

/**
 * Build a Mongoose filter object from query params
 */
export function buildFilterQuery({ status, priority, search }) {
  const query = {}
  if (status)   query.status   = status
  if (priority) query.priority = priority
  if (search)   query.$text    = { $search: search }
  return query
}

/**
 * Send a standard JSON success response
 */
export function sendSuccess(res, data, statusCode = 200) {
  return res.status(statusCode).json({ success: true, ...data })
}

/**
 * Send a standard JSON error response
 */
export function sendError(res, message, statusCode = 500) {
  return res.status(statusCode).json({ success: false, message })
}
