require('dotenv').config()
const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const setupStaticFiles = require('./middleware/staticFiles')
const swagger = require('./swagger')
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
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
)
app.use(express.json())

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
})

// Swagger API Documentation
app.use('/api-docs', swagger.serve, swagger.setup)

// Set up static file serving for local storage if using local provider
if (process.env.STORAGE_TYPE === 'local') {
  setupStaticFiles(app)
}

// Routes
app.use('/auth', authLimiter, authRoutes)
app.use('/memories', memoryRoutes)
app.use('/api/storage', uploadRoutes)
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
  console.log(
    `API Documentation available at http://localhost:${port}/api-docs`,
  )
})
