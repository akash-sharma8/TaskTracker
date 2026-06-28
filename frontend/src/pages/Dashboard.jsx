import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTasks } from '../hooks/useTasks'
import { taskService } from '../services/taskService'
import Loading from '../components/shared/Loading'
import TaskModal from '../components/tasks/TaskModal'
import TaskForm from '../components/tasks/TaskForm'
import Button from '../components/shared/Button'
import { TASK_STATUS, TASK_PRIORITY } from '../utils/constants'

function StatCard({ label, value, color, icon }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value ?? '—'}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { tasks, createTask, loading } = useTasks()
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    taskService.getStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setStatsLoading(false))
  }, [tasks]) // refresh when tasks change

  const handleCreate = async (values) => {
    setFormLoading(true)
    try {
      await createTask(values)
      setIsModalOpen(false)
    } finally {
      setFormLoading(false)
    }
  }

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 sm:pb-8">
      {/* Hero */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Good {getGreeting()}&nbsp;👋
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Here's an overview of your tasks.
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </Button>
      </div>

      {/* Stat cards */}
      {statsLoading ? (
        <Loading text="Loading stats…" className="py-8" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Tasks"
            value={stats?.total ?? tasks.length}
            color="bg-primary-50 dark:bg-primary-900/20"
            icon={<svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
          />
          <StatCard
            label="In Progress"
            value={stats?.inProgress ?? tasks.filter(t => t.status === TASK_STATUS.IN_PROGRESS).length}
            color="bg-amber-50 dark:bg-amber-900/20"
            icon={<svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard
            label="Completed"
            value={stats?.completed ?? tasks.filter(t => t.status === TASK_STATUS.COMPLETED).length}
            color="bg-emerald-50 dark:bg-emerald-900/20"
            icon={<svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard
            label="High Priority"
            value={stats?.highPriority ?? tasks.filter(t => t.priority === TASK_PRIORITY.HIGH).length}
            color="bg-red-50 dark:bg-red-900/20"
            icon={<svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
          />
        </div>
      )}

      {/* Progress bar */}
      {!statsLoading && tasks.length > 0 && (
        <div className="card p-5 mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-slate-700 dark:text-slate-300">Overall Progress</span>
            <span className="text-slate-500">
              {tasks.filter(t => t.status === TASK_STATUS.COMPLETED).length} / {tasks.length} completed
            </span>
          </div>
          <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${(tasks.filter(t => t.status === TASK_STATUS.COMPLETED).length / tasks.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Recent tasks */}
      <div className="card">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900 dark:text-white">Recent Tasks</h2>
          <Link to="/tasks" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
            View all →
          </Link>
        </div>
        {loading ? (
          <Loading text="Loading…" className="py-8" />
        ) : recentTasks.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">No tasks yet. Create one!</div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-700">
            {recentTasks.map((task) => (
              <li key={task._id} className="px-5 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  task.status === TASK_STATUS.COMPLETED ? 'bg-emerald-500' :
                  task.status === TASK_STATUS.IN_PROGRESS ? 'bg-amber-400' : 'bg-slate-300'
                }`} />
                <span className={`flex-1 text-sm truncate ${
                  task.status === TASK_STATUS.COMPLETED ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'
                }`}>{task.title}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  task.priority === 'high' ? 'badge-high' :
                  task.priority === 'medium' ? 'badge-medium' : 'badge-low'
                }`}>{task.priority}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Task">
        <TaskForm onSubmit={handleCreate} onCancel={() => setIsModalOpen(false)} loading={formLoading} />
      </TaskModal>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
