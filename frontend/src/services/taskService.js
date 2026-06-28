import api from './api'

export const taskService = {
  /** Fetch all tasks with optional query params */
  getAll: async (params = {}) => {
    const { data } = await api.get('/tasks', { params })
    return data
  },

  /** Get a single task */
  getById: async (id) => {
    const { data } = await api.get(`/tasks/${id}`)
    return data
  },

  /** Create a new task */
  create: async (taskData) => {
    const { data } = await api.post('/tasks', taskData)
    return data
  },

  /** Update an existing task */
  update: async (id, taskData) => {
    const { data } = await api.put(`/tasks/${id}`, taskData)
    return data
  },

  /** Delete a task */
  delete: async (id) => {
    const { data } = await api.delete(`/tasks/${id}`)
    return data
  },

  /** Get dashboard statistics */
  getStats: async () => {
    const { data } = await api.get('/tasks/stats')
    return data
  },
}
