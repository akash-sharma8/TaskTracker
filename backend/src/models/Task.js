import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title must be under 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description must be under 500 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['todo', 'in-progress', 'completed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'todo',
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: '{VALUE} is not a valid priority',
      },
      default: 'medium',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Auto-set completedAt when status changes to completed
taskSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    this.completedAt = this.status === 'completed' ? new Date() : null
  }
  next()
})

taskSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate()
  if (update?.status === 'completed') {
    update.completedAt = new Date()
  } else if (update?.status && update.status !== 'completed') {
    update.completedAt = null
  }
  next()
})

// Indexes for filtering & sorting
taskSchema.index({ status: 1 })
taskSchema.index({ priority: 1 })
taskSchema.index({ dueDate: 1 })
taskSchema.index({ createdAt: -1 })
taskSchema.index({ title: 'text', description: 'text', tags: 'text' })

const Task = mongoose.model('Task', taskSchema)
export default Task
