import { createContext, useReducer, useCallback, useEffect } from 'react'
import { taskService } from '../services/taskService'
import toast from 'react-hot-toast'

export const TaskContext = createContext(null)

const initialState = {
  tasks: [],
  stats: null,
  loading: false,
  statsLoading: false,
  error: null,
  filters: {
    status: '',
    priority: '',
    search: '',
    sort: 'createdAt_desc',
  },
}

function taskReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_STATS_LOADING':
      return { ...state, statsLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_TASKS':
      return { ...state, tasks: action.payload, loading: false, error: null }
    case 'SET_STATS':
      return { ...state, stats: action.payload, statsLoading: false }
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] }
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t._id === action.payload._id ? action.payload : t)),
      }
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((t) => t._id !== action.payload) }
    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.payload } }
    case 'RESET_FILTERS':
      return { ...state, filters: initialState.filters }
    default:
      return state
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState)

  const fetchTasks = useCallback(async (params = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const data = await taskService.getAll(params)
      dispatch({ type: 'SET_TASKS', payload: data.tasks || data })
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message })
      toast.error(err.message)
    }
  }, [])

  const fetchStats = useCallback(async () => {
    dispatch({ type: 'SET_STATS_LOADING', payload: true })
    try {
      const data = await taskService.getStats()
      dispatch({ type: 'SET_STATS', payload: data })
    } catch {
      dispatch({ type: 'SET_STATS_LOADING', payload: false })
    }
  }, [])

  const createTask = useCallback(async (taskData) => {
    try {
      const data = await taskService.create(taskData)
      dispatch({ type: 'ADD_TASK', payload: data.task || data })
      toast.success('Task created!')
      return data
    } catch (err) {
      toast.error(err.message)
      throw err
    }
  }, [])

  const updateTask = useCallback(async (id, taskData) => {
    try {
      const data = await taskService.update(id, taskData)
      dispatch({ type: 'UPDATE_TASK', payload: data.task || data })
      toast.success('Task updated!')
      return data
    } catch (err) {
      toast.error(err.message)
      throw err
    }
  }, [])

  const deleteTask = useCallback(async (id) => {
    try {
      await taskService.delete(id)
      dispatch({ type: 'DELETE_TASK', payload: id })
      toast.success('Task deleted')
    } catch (err) {
      toast.error(err.message)
      throw err
    }
  }, [])

  const setFilter = useCallback((filter) => {
    dispatch({ type: 'SET_FILTER', payload: filter })
  }, [])

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' })
  }, [])

  // Re-fetch when filters change
  useEffect(() => {
    const { status, priority, search, sort } = state.filters
    const [sortField, sortOrder] = sort.split('_')
    fetchTasks({
      ...(status && { status }),
      ...(priority && { priority }),
      ...(search && { search }),
      sortBy: sortField,
      order: sortOrder,
    })
  }, [state.filters, fetchTasks])

  return (
    <TaskContext.Provider
      value={{
        ...state,
        fetchTasks,
        fetchStats,
        createTask,
        updateTask,
        deleteTask,
        setFilter,
        resetFilters,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}
