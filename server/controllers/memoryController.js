const { v4: uuidv4 } = require('uuid')
const db = require('../utils/db')
const { deleteMemoryFiles } = require('./fileController')

const getMemories = async (req, res) => {
  const {
    user_id,
    page = 1,
    search = '',
    sort = 'timestamp',
    order = 'desc',
  } = req.query
  const limit = 10
  const offset = (page - 1) * limit

  if (user_id !== req.user.userId) {
    return res.status(403).json({ error: 'Unauthorized access' })
  }

  try {
    const memories = await new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM memories WHERE user_id = ? AND (title LIKE ? OR description LIKE ? OR tags LIKE ? OR timestamp LIKE ?) ORDER BY ${sort} ${order} LIMIT ? OFFSET ?`,
        [
          user_id,
          `%${search}%`,
          `%${search}%`,
          `%${search}%`,
          `%${search}%`,
          limit,
          offset,
        ],
        (err, rows) => {
          if (err) reject(err)
          else
            resolve(
              rows.map((row) => ({
                ...row,
                tags: row.tags ? JSON.parse(row.tags) : [],
                image_urls: JSON.parse(row.image_urls),
              })),
            )
        },
      )
    })
    res.json({ memories })
  } catch (err) {
    console.error('Error fetching memories:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

const createMemory = async (req, res) => {
  const {
    user_id,
    title,
    description,
    image_urls,
    timestamp,
    tags = [],
  } = req.body

  if (user_id !== req.user.userId) {
    return res.status(403).json({ error: 'Unauthorized access' })
  }

  const public_id = uuidv4()

  try {
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO memories (user_id, title, description, image_urls, timestamp, tags, public_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          user_id,
          title,
          description,
          JSON.stringify(image_urls),
          timestamp,
          JSON.stringify(tags),
          public_id,
        ],
        (err) => {
          if (err) {
            console.error('Error inserting memory:', err)
            reject(err)
          } else {
            resolve()
          }
        },
      )
    })
    res.status(201).json({ message: 'Memory created successfully', public_id })
  } catch (err) {
    console.error('Error saving memory:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

const updateMemory = async (req, res) => {
  const { id } = req.params
  const { title, description, image_urls, timestamp, tags = [] } = req.body

  try {
    const memory = await new Promise((resolve, reject) => {
      db.get(
        'SELECT user_id, image_urls FROM memories WHERE id = ?',
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

    const oldImageUrls = JSON.parse(memory.image_urls)
    const newImageUrls = image_urls
    const imagesToDelete = oldImageUrls.filter(
      (url) => !newImageUrls.includes(url),
    )

    // Delete removed images
    if (imagesToDelete.length > 0) {
      await deleteMemoryFiles(imagesToDelete)
    }

    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE memories SET title = ?, description = ?, image_urls = ?, timestamp = ?, tags = ? WHERE id = ?',
        [
          title,
          description,
          JSON.stringify(newImageUrls),
          timestamp,
          JSON.stringify(tags),
          id,
        ],
        (err) => {
          if (err) reject(err)
          else resolve()
        },
      )
    })
    res.json({ message: 'Memory updated successfully' })
  } catch (err) {
    console.error('Error updating memory:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

const deleteMemory = async (req, res) => {
  const { id } = req.params

  try {
    const memory = await new Promise((resolve, reject) => {
      db.get(
        'SELECT user_id, image_urls FROM memories WHERE id = ?',
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

    const imageUrls = JSON.parse(memory.image_urls)

    // Delete the memory's files
    if (imageUrls.length > 0) {
      await deleteMemoryFiles(imageUrls)
    }

    await new Promise((resolve, reject) => {
      db.run('DELETE FROM memories WHERE id = ?', [id], (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
    res.json({ message: 'Memory deleted successfully' })
  } catch (err) {
    console.error('Error deleting memory:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

const toggleFavorite = async (req, res) => {
  const { id } = req.params

  try {
    const memory = await new Promise((resolve, reject) => {
      db.get('SELECT user_id FROM memories WHERE id = ?', [id], (err, row) => {
        if (err) reject(err)
        else resolve(row)
      })
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
  } catch (err) {
    console.error('Error toggling favorite:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

const getMemory = async (req, res) => {
  const { id } = req.params

  try {
    const memory = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM memories WHERE id = ?', [id], (err, row) => {
        if (err) reject(err)
        else resolve(row)
      })
    })

    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' })
    }

    if (memory.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized access' })
    }

    res.json({
      ...memory,
      image_urls: JSON.parse(memory.image_urls),
      tags: memory.tags ? JSON.parse(memory.tags) : [],
    })
  } catch (err) {
    console.error('Error fetching memory:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

const getRandomMemories = async (req, res) => {
  const { user_id } = req.query

  if (user_id !== req.user.userId) {
    return res.status(403).json({ error: 'Unauthorized access' })
  }

  try {
    const memories = await new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM memories WHERE user_id = ? ORDER BY RANDOM() LIMIT 3',
        [user_id],
        (err, rows) => {
          if (err) reject(err)
          else
            resolve(
              rows.map((row) => ({
                ...row,
                tags: row.tags ? JSON.parse(row.tags) : [],
                image_urls: JSON.parse(row.image_urls),
              })),
            )
        },
      )
    })
    res.json({ memories })
  } catch (err) {
    console.error('Error fetching random memories:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

const getAllMemories = async (req, res) => {
  const { user_id, search = '', sort = 'timestamp', order = 'desc' } = req.query

  if (user_id !== req.user.userId) {
    return res.status(403).json({ error: 'Unauthorized access' })
  }

  try {
    const memories = await new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM memories WHERE user_id = ? AND (title LIKE ? OR description LIKE ? OR tags LIKE ? OR timestamp LIKE ?) ORDER BY ${sort} ${order}`,
        [user_id, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`],
        (err, rows) => {
          if (err) reject(err)
          else
            resolve(
              rows.map((row) => ({
                ...row,
                tags: row.tags ? JSON.parse(row.tags) : [],
                image_urls: JSON.parse(row.image_urls),
              })),
            )
        },
      )
    })
    res.json({ memories })
  } catch (err) {
    console.error('Error fetching all memories:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

const getPublicMemories = async (req, res) => {
  const { user_id } = req.params
  const { search = '' } = req.query
  let { sort = 'timestamp', order = 'desc' } = req.query

  // Validate sort and order parameters
  const validSortFields = ['timestamp', 'title']
  const validOrders = ['asc', 'desc']

  if (!validSortFields.includes(sort)) {
    sort = 'timestamp'
  }
  if (!validOrders.includes(order)) {
    order = 'desc'
  }

  try {
    // Get user and memories in parallel
    const [user, memories] = await Promise.all([
      new Promise((resolve, reject) => {
        db.get(
          'SELECT id, name FROM users WHERE id = ?',
          [user_id],
          (err, row) => {
            if (err) reject(err)
            else resolve(row)
          },
        )
      }),
      new Promise((resolve, reject) => {
        db.all(
          `SELECT id, title, description, image_urls, timestamp, tags, public_id
           FROM memories
           WHERE user_id = ?
           AND (title LIKE ? OR description LIKE ? OR tags LIKE ? OR timestamp LIKE ?)
           ORDER BY ${sort} ${order}`,
          [user_id, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`],
          (err, rows) => {
            if (err) reject(err)
            else
              resolve(
                rows.map((row) => ({
                  ...row,
                  tags: row.tags ? JSON.parse(row.tags) : [],
                  image_urls: JSON.parse(row.image_urls),
                })),
              )
          },
        )
      }),
    ])

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    return res.json({ memories, user })
  } catch (err) {
    console.error('Error fetching public memories:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}

const getPublicMemory = async (req, res) => {
  const { public_id } = req.params

  try {
    const memory = await new Promise((resolve, reject) => {
      db.get(
        'SELECT id, title, description, image_urls, timestamp, tags, public_id FROM memories WHERE public_id = ?',
        [public_id],
        (err, row) => {
          if (err) reject(err)
          else resolve(row)
        },
      )
    })

    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' })
    }

    return res.json({
      ...memory,
      image_urls: JSON.parse(memory.image_urls),
      tags: memory.tags ? JSON.parse(memory.tags) : [],
    })
  } catch (err) {
    console.error('Error fetching public memory:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}

module.exports = {
  getMemories,
  createMemory,
  updateMemory,
  deleteMemory,
  toggleFavorite,
  getMemory,
  getRandomMemories,
  getAllMemories,
  getPublicMemory,
  getPublicMemories,
}
