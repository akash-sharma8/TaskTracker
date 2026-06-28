import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from 'date-fns'

export const formatDate = (dateString) => {
  if (!dateString) return '—'
  try {
    return format(new Date(dateString), 'MMM d, yyyy')
  } catch {
    return '—'
  }
}

export const formatRelative = (dateString) => {
  if (!dateString) return ''
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
  } catch {
    return ''
  }
}

export const getDueDateLabel = (dateString) => {
  if (!dateString) return null
  try {
    const date = new Date(dateString)
    if (isToday(date)) return 'Due today'
    if (isTomorrow(date)) return 'Due tomorrow'
    if (isPast(date)) return `Overdue · ${formatDate(dateString)}`
    return `Due ${formatDate(dateString)}`
  } catch {
    return null
  }
}

export const isDueDateOverdue = (dateString) => {
  if (!dateString) return false
  try {
    return isPast(new Date(dateString))
  } catch {
    return false
  }
}

export const isDueDateSoon = (dateString) => {
  if (!dateString) return false
  try {
    const date = new Date(dateString)
    return isToday(date) || isTomorrow(date)
  } catch {
    return false
  }
}

export const formatInputDate = (dateString) => {
  if (!dateString) return ''
  try {
    return format(new Date(dateString), 'yyyy-MM-dd')
  } catch {
    return ''
  }
}
