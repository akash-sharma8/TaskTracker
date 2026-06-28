export const validateTaskForm = (values) => {
  const errors = {}

  if (!values.title || !values.title.trim()) {
    errors.title = 'Title is required'
  } else if (values.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters'
  } else if (values.title.trim().length > 100) {
    errors.title = 'Title must be under 100 characters'
  }

  if (values.description && values.description.length > 500) {
    errors.description = 'Description must be under 500 characters'
  }

  if (!values.status) {
    errors.status = 'Status is required'
  }

  if (!values.priority) {
    errors.priority = 'Priority is required'
  }

  if (values.dueDate) {
    const date = new Date(values.dueDate)
    if (isNaN(date.getTime())) {
      errors.dueDate = 'Invalid date format'
    }
  }

  return errors
}

export const isFormValid = (errors) => Object.keys(errors).length === 0
