import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <p className="text-8xl font-bold text-slate-100 dark:text-slate-800 select-none">404</p>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white -mt-8">Page not found</h1>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="btn-primary mt-2"
      >
        ← Back to Dashboard
      </Link>
    </div>
  )
}
