require('dotenv').config()
const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const multer = require('multer')
const setupStaticFiles = require('./middleware/staticFiles')
const authRoutes = require('./routes/authRoutes')
const memoryRoutes = require('./routes/memoryRoutes')
const uploadRoutes = require('./routes/uploadRoutes')
const emailRoutes = require('./routes/emailRoutes')
const socialRoutes = require('./routes/socialRoutes')
const db = require('./utils/db')

const app = express()
const port = process.env.PORT || 4001

// Security middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
)
app.use(express.json())

// Configure multer for local storage if using local provider
if (process.env.STORAGE_TYPE === 'local') {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = `${process.env.LOCAL_STORAGE_PATH || 'uploads'}/${req.body.key}`
      cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
      cb(null, req.body.key.split('/').pop())
    },
  })

  const upload = multer({ storage })
  app.post('/api/upload', upload.single('file'), (req, res) => {
    res.json({
      success: true,
      fileUrl: `${process.env.BASE_URL || 'http://localhost:4001'}/uploads/${req.body.key}`,
    })
  })

  // Set up static file serving for local storage
  setupStaticFiles(app)
}

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
})

// Routes
app.use('/auth', authLimiter, authRoutes)
app.use('/memories', memoryRoutes)
app.use('/api/storage', uploadRoutes) // Changed route prefix for clarity
app.use('/email', emailRoutes)
app.use('/social', socialRoutes)

// Error handling middleware
app.use((err, req, res, _next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something broke!' })
})

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message)
    }
    console.log('Closed the database connection.')
    process.exit(0)
  })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
  console.log(`Storage provider: ${process.env.STORAGE_TYPE || 'local'}`)
})
