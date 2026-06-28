import Button from './Button'

export default function EmptyState({
  title = 'No tasks yet',
  description = 'Create your first task to get started.',
  action,
  actionLabel = 'Create Task',
  icon: Icon,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        {Icon ? (
          <Icon size={28} className="text-slate-400" />
        ) : (
          <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        )}
      </div>
      <div>
        <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">{title}</h3>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500 max-w-xs">{description}</p>
      </div>
      {action && (
        <Button variant="primary" onClick={action}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
