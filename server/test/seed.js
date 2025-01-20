const bcrypt = require('bcryptjs')
const db = require('../utils/db')

const TEST_USER = {
  email: 'test@example.com',
  password: 'Password123!',
  name: 'Test User',
}

const TEST_MEMORIES = [
  {
    title: 'Test Memory 1',
    description: 'First test memory',
    image_urls: JSON.stringify(['test1.jpg']),
    timestamp: new Date().toISOString(),
    tags: JSON.stringify(['test', 'first']),
    is_favorite: 0,
  },
  {
    title: 'Test Memory 2',
    description: 'Second test memory',
    image_urls: JSON.stringify(['test2.jpg']),
    timestamp: new Date().toISOString(),
    tags: JSON.stringify(['test', 'second']),
    is_favorite: 1,
  },
]

async function seedTestData() {
  // Create test tables
  await db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL
    )
  `)

  await db.run(`
    CREATE TABLE IF NOT EXISTS memories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      image_urls TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      tags TEXT,
      is_favorite INTEGER DEFAULT 0,
      public_id TEXT UNIQUE,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `)

  // Create test user
  const hashedPassword = await bcrypt.hash(TEST_USER.password, 10)
  const userResult = await db.run(
    'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
    [TEST_USER.email, hashedPassword, TEST_USER.name],
  )

  // Create test memories
  for (const memory of TEST_MEMORIES) {
    await db.run(
      `INSERT INTO memories (
        user_id, title, description, image_urls, timestamp, tags, is_favorite
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userResult.lastID,
        memory.title,
        memory.description,
        memory.image_urls,
        memory.timestamp,
        memory.tags,
        memory.is_favorite,
      ],
    )
  }
}

async function clearTestData() {
  await db.run('DROP TABLE IF EXISTS memories')
  await db.run('DROP TABLE IF EXISTS users')
}

module.exports = {
  seedTestData,
  clearTestData,
  TEST_USER,
}
