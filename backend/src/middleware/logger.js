import morgan from 'morgan'

// Concise log format in dev, combined in prod
export const logger = morgan(
  process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
)
