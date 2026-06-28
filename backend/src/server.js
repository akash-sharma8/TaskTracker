import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { logger } from './middleware/logger.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import taskRoutes from './routes/taskRoutes.js'

const app = express()

// ─── Security & Core Middleware ───────────────────────────────────────────────
app.use(helmet())

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
)

app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))
app.use(logger)

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/tasks', taskRoutes)

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

export default app
