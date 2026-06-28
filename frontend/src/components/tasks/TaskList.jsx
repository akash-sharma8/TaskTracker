import { useState } from 'react'
import { useTasks } from '../../hooks/useTasks'
import TaskCard from './TaskCard'
import TaskModal from './TaskModal'
import TaskForm from './TaskForm'
import Loading from '../shared/Loading'
import EmptyState from '../shared/EmptyState'

export default function TaskList() {
  const { tasks, loading, createTask, updateTask } = useTasks()
  const [editingTask, setEditingTask] = useState(null)
  const [formLoading, setFormLoading] = useState(false)

  const handleUpdate = async (values) => {
    setFormLoading(true)
    try {
      await updateTask(editingTask._id, values)
      setEditingTask(null)
    } finally {
      setFormLoading(false)
    }
  }

  if (loading) return <Loading />

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks found"
        description="Adjust your filters or create a new task to get started."
      />
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={() => setEditingTask(task)}
          />
        ))}
      </div>

      <TaskModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Edit Task"
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleUpdate}
          onCancel={() => setEditingTask(null)}
          loading={formLoading}
        />
      </TaskModal>
    </>
  )
}
