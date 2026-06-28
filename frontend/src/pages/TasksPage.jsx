import { useState } from 'react'
import { useTasks } from '../hooks/useTasks'
import TaskFilters from '../components/tasks/TaskFilters'
import TaskList from '../components/tasks/TaskList'
import TaskModal from '../components/tasks/TaskModal'
import TaskForm from '../components/tasks/TaskForm'
import Button from '../components/shared/Button'

export default function TasksPage() {
  const { tasks, createTask } = useTasks()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  const handleCreate = async (values) => {
    setFormLoading(true)
    try {
      await createTask(values)
      setIsModalOpen(false)
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 sm:pb-8">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">All Tasks</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <TaskFilters />
      </div>

      {/* Task grid */}
      <TaskList />

      {/* Create modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Task"
      >
        <TaskForm
          onSubmit={handleCreate}
          onCancel={() => setIsModalOpen(false)}
          loading={formLoading}
        />
      </TaskModal>
    </div>
  )
}
