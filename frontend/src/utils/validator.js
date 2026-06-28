export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? '' : 'Invalid email address';
};
 
export const validateTitle = (title) => {
  if (!title) return 'Title is required';
  if (title.length < 3) return 'Title must be at least 3 characters';
  if (title.length > 100) return 'Title cannot exceed 100 characters';
  return '';
};
 
export const validateDescription = (description) => {
  if (description && description.length > 1000) {
    return 'Description cannot exceed 1000 characters';
  }
  return '';
};
 
export const validatePriority = (priority) => {
  const validPriorities = ['low', 'medium', 'high'];
  return !validPriorities.includes(priority) ? 'Invalid priority' : '';
};
 
export const validateStatus = (status) => {
  const validStatuses = ['pending', 'in-progress', 'completed'];
  return !validStatuses.includes(status) ? 'Invalid status' : '';
};
 
export const validateDueDate = (dueDate) => {
  if (!dueDate) return '';
  const selected = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selected < today) {
    return 'Due date cannot be in the past';
  }
  return '';
};
 
export const validateTaskForm = (formData) => {
  const errors = {};
 
  const titleError = validateTitle(formData.title);
  if (titleError) errors.title = titleError;
 
  const descError = validateDescription(formData.description);
  if (descError) errors.description = descError;
 
  const priorityError = validatePriority(formData.priority);
  if (priorityError) errors.priority = priorityError;
 
  const statusError = validateStatus(formData.status);
  if (statusError) errors.status = statusError;
 
  const dueDateError = validateDueDate(formData.dueDate);
  if (dueDateError) errors.dueDate = dueDateError;
 
  return errors;
};
 
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};