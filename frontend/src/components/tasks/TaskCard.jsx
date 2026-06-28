import { useState } from 'react'
import { useTasks } from '../../hooks/useTasks'
import { getDueDateLabel, isDueDateOverdue, isDueDateSoon } from '../../utils/formatters'
import { TASK_STATUS } from '../../utils/constants'

const STATUS_CLASS = {
  todo: 'badge-todo',
  'in-progress': 'badge-in-progress',
  completed: 'badge-completed',
}

const PRIORITY_CLASS = {
  low: 'badge-low',
  medium: 'badge-medium',
  high: 'badge-high',
}

const STATUS_LABEL = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  completed: 'Completed',
}

const PRIORITY_ICON = {
  low: '↓',
  medium: '→',
  high: '↑',
}

export default function TaskCard({ task, onEdit }) {
  const { deleteTask, updateTask } = useTasks()
  const [deleting, setDeleting] = useState(false)
  const [toggling, setToggling] = useState(false)

  const dueDateLabel = getDueDateLabel(task.dueDate)
  const overdue = isDueDateOverdue(task.dueDate) && task.status !== TASK_STATUS.COMPLETED
  const soon = isDueDateSoon(task.dueDate) && !overdue

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return
    setDeleting(true)
    try {
      await deleteTask(task._id)
    } finally {
      setDeleting(false)
    }
  }

  const toggleComplete = async () => {
    setToggling(true)
    try {
      await updateTask(task._id, {
        ...task,
        status: task.status === TASK_STATUS.COMPLETED ? TASK_STATUS.TODO : TASK_STATUS.COMPLETED,
      })
    } finally {
      setToggling(false)
    }
  }

  return (
    <div className={`card p-4 flex flex-col gap-3 animate-fade-in group hover:shadow-md transition-shadow ${
      task.status === TASK_STATUS.COMPLETED ? 'opacity-75' : ''
    }`}>
      {/* Top row: checkbox + title + actions */}
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={toggleComplete}
          disabled={toggling}
          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
            task.status === TASK_STATUS.COMPLETED
              ? 'border-emerald-500 bg-emerald-500'
              : 'border-slate-300 dark:border-slate-600 hover:border-emerald-400'
          }`}
          aria-label={task.status === TASK_STATUS.COMPLETED ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.status === TASK_STATUS.COMPLETED && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug truncate ${
            task.status === TASK_STATUS.COMPLETED ? 'line-through text-slate-400 dark:text-slate-500' : ''
          }`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{task.description}</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-md text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
            aria-label="Edit task"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            aria-label="Delete task"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Meta row: badges + due date */}
      <div className="flex flex-wrap items-center gap-2">
        <span className={STATUS_CLASS[task.status]}>{STATUS_LABEL[task.status]}</span>
        <span className={PRIORITY_CLASS[task.priority]}>
          {PRIORITY_ICON[task.priority]} {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>

        {dueDateLabel && (
          <span className={`text-xs font-medium ${
            overdue
              ? 'text-red-500 dark:text-red-400'
              : soon
              ? 'text-amber-500 dark:text-amber-400'
              : 'text-slate-400 dark:text-slate-500'
          }`}>
            {overdue && '⚠ '}{dueDateLabel}
          </span>
        )}
      </div>

      {/* Tags */}
      {task.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
