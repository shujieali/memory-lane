require('dotenv').config()
const express = require('express')
const sqlite3 = require('sqlite3')
const cors = require('cors')
const crypto = require('crypto')
const rateLimit = require('express-rate-limit')
const { body, query, param, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

const app = express()
const port = process.env.PORT || 4001
const JWT_SECRET = process.env.JWT_SECRET

// Security middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
)
app.use(express.json())

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
})

// Database setup
const db = new sqlite3.Database(process.env.DB_PATH)
db.serialize(() => {
  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON')

  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Create memories table with foreign key
  db.run(`
    CREATE TABLE IF NOT EXISTS memories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT NOT NULL,
      timestamp DATE NOT NULL,
      is_favorite BOOLEAN DEFAULT 0,
      tags TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `)

  // Create indexes
  db.run('CREATE INDEX IF NOT EXISTS idx_memories_user_id ON memories(user_id)')
  db.run('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)')
})

// Helper functions
const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex')
  return `${salt}:${hash}`
}

const verifyPassword = (password, storedHash) => {
  const [salt, hash] = storedHash.split(':')
  const verifyHash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex')
  return hash === verifyHash
}

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' })
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' })
    }
    req.user = user
    next()
  })
}

const validateRequest = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

// Auth endpoints
app.post(
  '/auth/register',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
      .withMessage(
        'Password must be at least 8 characters long and include at least one letter, one number, and one special character',
      ),
    body('name').trim().notEmpty(),
  ],
  validateRequest,
  async (req, res) => {
    const { email, password, name } = req.body

    try {
      const userId = crypto.randomUUID()
      const passwordHash = hashPassword(password)

      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO users (id, email, name, password_hash) VALUES (?, ?, ?, ?)',
          [userId, email, name, passwordHash],
          (err) => {
            if (err) reject(err)
            else resolve()
          },
        )
      })

      const token = generateToken(userId)
      res.status(201).json({
        user: {
          id: userId,
          email,
          name,
        },
        token,
      })
    } catch (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(409).json({ error: 'Email already exists' })
      } else {
        res.status(500).json({ error: 'Server error' })
      }
    }
  },
)

app.post(
  '/auth/login',
  authLimiter,
  [body('email').isEmail().normalizeEmail(), body('password').notEmpty()],
  validateRequest,
  async (req, res) => {
    const { email, password } = req.body

    try {
      const user = await new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
          if (err) reject(err)
          else resolve(row)
        })
      })

      if (!user || !verifyPassword(password, user.password_hash)) {
        return res.status(401).json({ error: 'Invalid email or password' })
      }

      const token = generateToken(user.id)
      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      })
    } catch (_err) {
      res.status(500).json({ error: 'Server error' })
    }
  },
)

// Memory endpoints
app.get(
  '/memories',
  authenticateToken,
  [query('user_id').notEmpty()],
  validateRequest,
  async (req, res) => {
    const { user_id } = req.query

    // Verify user is accessing their own memories
    if (user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized access' })
    }

    try {
      const memories = await new Promise((resolve, reject) => {
        db.all(
          'SELECT * FROM memories WHERE user_id = ? ORDER BY timestamp DESC',
          [user_id],
          (err, rows) => {
            if (err) reject(err)
            else
              resolve(
                rows.map((row) => ({
                  ...row,
                  tags: row.tags ? JSON.parse(row.tags) : [],
                })),
              )
          },
        )
      })
      res.json({ memories })
    } catch (_err) {
      res.status(500).json({ error: 'Server error' })
    }
  },
)

app.post(
  '/memories',
  authenticateToken,
  [
    body('user_id').notEmpty(),
    body('title').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('image_url').isURL(),
    body('timestamp').isISO8601(),
    body('tags').optional().isArray(),
  ],
  validateRequest,
  async (req, res) => {
    const {
      user_id,
      title,
      description,
      image_url,
      timestamp,
      tags = [],
    } = req.body

    // Verify user is creating their own memory
    if (user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized access' })
    }

    try {
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO memories (user_id, title, description, image_url, timestamp, tags) VALUES (?, ?, ?, ?, ?, ?)',
          [
            user_id,
            title,
            description,
            image_url,
            timestamp,
            JSON.stringify(tags),
          ],
          (err) => {
            if (err) reject(err)
            else resolve()
          },
        )
      })
      res.status(201).json({ message: 'Memory created successfully' })
    } catch (_err) {
      res.status(500).json({ error: 'Server error' })
    }
  },
)

app.put(
  '/memories/:id',
  authenticateToken,
  [
    param('id').isInt(),
    body('title').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('image_url').isURL(),
    body('timestamp').isISO8601(),
    body('tags').optional().isArray(),
  ],
  validateRequest,
  async (req, res) => {
    const { id } = req.params
    const { title, description, image_url, timestamp, tags = [] } = req.body

    try {
      // Verify memory ownership
      const memory = await new Promise((resolve, reject) => {
        db.get(
          'SELECT user_id FROM memories WHERE id = ?',
          [id],
          (err, row) => {
            if (err) reject(err)
            else resolve(row)
          },
        )
      })

      if (!memory) {
        return res.status(404).json({ error: 'Memory not found' })
      }

      if (memory.user_id !== req.user.userId) {
        return res.status(403).json({ error: 'Unauthorized access' })
      }

      await new Promise((resolve, reject) => {
        db.run(
          'UPDATE memories SET title = ?, description = ?, image_url = ?, timestamp = ?, tags = ? WHERE id = ?',
          [title, description, image_url, timestamp, JSON.stringify(tags), id],
          (err) => {
            if (err) reject(err)
            else resolve()
          },
        )
      })
      res.json({ message: 'Memory updated successfully' })
    } catch (_err) {
      res.status(500).json({ error: 'Server error' })
    }
  },
)

app.delete(
  '/memories/:id',
  authenticateToken,
  [param('id').isInt()],
  validateRequest,
  async (req, res) => {
    const { id } = req.params

    try {
      // Verify memory ownership
      const memory = await new Promise((resolve, reject) => {
        db.get(
          'SELECT user_id FROM memories WHERE id = ?',
          [id],
          (err, row) => {
            if (err) reject(err)
            else resolve(row)
          },
        )
      })

      if (!memory) {
        return res.status(404).json({ error: 'Memory not found' })
      }

      if (memory.user_id !== req.user.userId) {
        return res.status(403).json({ error: 'Unauthorized access' })
      }

      await new Promise((resolve, reject) => {
        db.run('DELETE FROM memories WHERE id = ?', [id], (err) => {
          if (err) reject(err)
          else resolve()
        })
      })
      res.json({ message: 'Memory deleted successfully' })
    } catch (_err) {
      res.status(500).json({ error: 'Server error' })
    }
  },
)

app.post(
  '/memories/:id/favorite',
  authenticateToken,
  [param('id').isInt()],
  validateRequest,
  async (req, res) => {
    const { id } = req.params

    try {
      // Verify memory ownership
      const memory = await new Promise((resolve, reject) => {
        db.get(
          'SELECT user_id FROM memories WHERE id = ?',
          [id],
          (err, row) => {
            if (err) reject(err)
            else resolve(row)
          },
        )
      })

      if (!memory) {
        return res.status(404).json({ error: 'Memory not found' })
      }

      if (memory.user_id !== req.user.userId) {
        return res.status(403).json({ error: 'Unauthorized access' })
      }

      await new Promise((resolve, reject) => {
        db.run(
          'UPDATE memories SET is_favorite = CASE WHEN is_favorite = 1 THEN 0 ELSE 1 END WHERE id = ?',
          [id],
          (err) => {
            if (err) reject(err)
            else resolve()
          },
        )
      })

      const updatedMemory = await new Promise((resolve, reject) => {
        db.get(
          'SELECT is_favorite FROM memories WHERE id = ?',
          [id],
          (err, row) => {
            if (err) reject(err)
            else resolve(row)
          },
        )
      })

      res.json({ is_favorite: updatedMemory.is_favorite })
    } catch (_err) {
      res.status(500).json({ error: 'Server error' })
    }
  },
)

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
})
