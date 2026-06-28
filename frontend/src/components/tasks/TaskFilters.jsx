import { useTasks } from '../../hooks/useTasks'
import { useDebounce } from '../../hooks/useDebounce'
import { useEffect, useState } from 'react'
import { SORT_OPTIONS, TASK_STATUS, TASK_PRIORITY, STATUS_LABELS, PRIORITY_LABELS } from '../../utils/constants'
import Select from '../shared/Select'

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: TASK_STATUS.TODO, label: STATUS_LABELS[TASK_STATUS.TODO] },
  { value: TASK_STATUS.IN_PROGRESS, label: STATUS_LABELS[TASK_STATUS.IN_PROGRESS] },
  { value: TASK_STATUS.COMPLETED, label: STATUS_LABELS[TASK_STATUS.COMPLETED] },
]

const PRIORITY_OPTIONS = [
  { value: '', label: 'All Priorities' },
  { value: TASK_PRIORITY.HIGH, label: PRIORITY_LABELS[TASK_PRIORITY.HIGH] },
  { value: TASK_PRIORITY.MEDIUM, label: PRIORITY_LABELS[TASK_PRIORITY.MEDIUM] },
  { value: TASK_PRIORITY.LOW, label: PRIORITY_LABELS[TASK_PRIORITY.LOW] },
]

export default function TaskFilters() {
  const { filters, setFilter, resetFilters } = useTasks()
  const [searchInput, setSearchInput] = useState(filters.search)
  const debouncedSearch = useDebounce(searchInput, 400)

  useEffect(() => {
    setFilter({ search: debouncedSearch })
  }, [debouncedSearch, setFilter])

  const hasActive =
    filters.status || filters.priority || filters.search || filters.sort !== 'createdAt_desc'

  return (
    <div className="card p-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            placeholder="Search tasks…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="input-base pl-9"
          />
        </div>

        {/* Status */}
        <Select
          options={STATUS_OPTIONS}
          value={filters.status}
          onChange={(e) => setFilter({ status: e.target.value })}
          className="sm:w-40"
        />

        {/* Priority */}
        <Select
          options={PRIORITY_OPTIONS}
          value={filters.priority}
          onChange={(e) => setFilter({ priority: e.target.value })}
          className="sm:w-40"
        />

        {/* Sort */}
        <Select
          options={SORT_OPTIONS}
          value={filters.sort}
          onChange={(e) => setFilter({ sort: e.target.value })}
          className="sm:w-48"
        />

        {/* Reset */}
        {hasActive && (
          <button
            onClick={resetFilters}
            className="btn-ghost whitespace-nowrap"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
