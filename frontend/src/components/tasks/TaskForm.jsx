import { useEffect } from 'react'
import { useForm } from '../../hooks/useForm'
import { validateTaskForm } from '../../utils/validators'
import { formatInputDate } from '../../utils/formatters'
import { TASK_STATUS, TASK_PRIORITY, STATUS_LABELS, PRIORITY_LABELS } from '../../utils/constants'
import Input from '../shared/Input'
import Select from '../shared/Select'
import Button from '../shared/Button'

const DEFAULT_VALUES = {
  title: '',
  description: '',
  status: TASK_STATUS.TODO,
  priority: TASK_PRIORITY.MEDIUM,
  dueDate: '',
  tags: '',
}

const STATUS_OPTIONS = Object.values(TASK_STATUS).map((v) => ({ value: v, label: STATUS_LABELS[v] }))
const PRIORITY_OPTIONS = Object.values(TASK_PRIORITY).map((v) => ({ value: v, label: PRIORITY_LABELS[v] }))

export default function TaskForm({ task, onSubmit, onCancel, loading }) {
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, reset } = useForm(
    DEFAULT_VALUES,
    validateTaskForm,
  )

  // Populate form when editing
  useEffect(() => {
    if (task) {
      reset({
        title: task.title || '',
        description: task.description || '',
        status: task.status || TASK_STATUS.TODO,
        priority: task.priority || TASK_PRIORITY.MEDIUM,
        dueDate: task.dueDate ? formatInputDate(task.dueDate) : '',
        tags: Array.isArray(task.tags) ? task.tags.join(', ') : '',
      })
    } else {
      reset(DEFAULT_VALUES)
    }
  }, [task]) // eslint-disable-line react-hooks/exhaustive-deps

  const submit = handleSubmit((vals) => {
    const payload = {
      ...vals,
      title: vals.title.trim(),
      description: vals.description.trim(),
      dueDate: vals.dueDate || null,
      tags: vals.tags
        ? vals.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    }
    onSubmit(payload)
  })

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <Input
        label="Title"
        name="title"
        value={values.title}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.title ? errors.title : undefined}
        placeholder="What needs to be done?"
        required
        autoFocus
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={3}
          placeholder="Add more details… (optional)"
          className={`input-base resize-none ${touched.description && errors.description ? 'input-error' : ''}`}
        />
        {touched.description && errors.description && (
          <p className="text-xs text-red-500">{errors.description}</p>
        )}
        <p className="text-xs text-slate-400 text-right">{values.description.length}/500</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Status"
          name="status"
          value={values.status}
          onChange={handleChange}
          onBlur={handleBlur}
          options={STATUS_OPTIONS}
          error={touched.status ? errors.status : undefined}
          required
        />
        <Select
          label="Priority"
          name="priority"
          value={values.priority}
          onChange={handleChange}
          onBlur={handleBlur}
          options={PRIORITY_OPTIONS}
          error={touched.priority ? errors.priority : undefined}
          required
        />
      </div>

      <Input
        label="Due Date"
        name="dueDate"
        type="date"
        value={values.dueDate}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.dueDate ? errors.dueDate : undefined}
      />

      <Input
        label="Tags"
        name="tags"
        value={values.tags}
        onChange={handleChange}
        placeholder="design, backend, urgent  (comma-separated)"
        hint="Separate multiple tags with commas"
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {task ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  )
}
