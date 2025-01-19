const crypto = require('crypto')
const db = require('../utils/db')
const { hashPassword, verifyPassword, generateToken } = require('../utils/auth')

const register = async (req, res) => {
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
}

const login = async (req, res) => {
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
}

module.exports = {
  register,
  login,
}
