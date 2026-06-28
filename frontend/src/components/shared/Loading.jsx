export default function Loading({ text = 'Loading tasks…', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-16 ${className}`}>
      <div className="relative">
        <div className="w-10 h-10 border-4 border-primary-200 dark:border-primary-900 rounded-full" />
        <div className="absolute inset-0 w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="text-sm text-slate-400 dark:text-slate-500">{text}</p>
    </div>
  )
}
