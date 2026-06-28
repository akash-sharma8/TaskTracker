import 'dotenv/config'
import app from './server.js'
import { connectDB } from './config/database.js'

const PORT = process.env.PORT || 5000

async function bootstrap() {
  await connectDB()

  const server = app.listen(PORT, () => {
    console.log(`🚀  Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
  })

  // Graceful shutdown
  const shutdown = (signal) => {
    console.log(`\n${signal} received — shutting down gracefully…`)
    server.close(() => {
      console.log('💤  HTTP server closed')
      process.exit(0)
    })
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT',  () => shutdown('SIGINT'))
  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err)
    server.close(() => process.exit(1))
  })
}

bootstrap()
