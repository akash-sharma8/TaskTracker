export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p className="text-center text-xs text-slate-400 dark:text-slate-500">
          TaskTracker · MERN Stack · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}
