import mongoose from 'mongoose'

export async function connectDB() {
  const uri = process.env.MONGO_URI
  if (!uri) throw new Error('MONGO_URI is not defined in environment variables')

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    })
    console.log(`✅  MongoDB connected: ${conn.connection.host}`)
  } catch (err) {
    console.error('❌  MongoDB connection error:', err.message)
    process.exit(1)
  }

  mongoose.connection.on('disconnected', () =>
    console.warn('⚠️   MongoDB disconnected'),
  )
  mongoose.connection.on('reconnected', () =>
    console.log('🔄  MongoDB reconnected'),
  )
}
