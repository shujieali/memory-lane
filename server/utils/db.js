const sqlite3 = require('sqlite3')
const db = new sqlite3.Database(process.env.DB_PATH)

db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON')

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS memories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      image_urls TEXT NOT NULL,
      timestamp DATE NOT NULL,
      is_favorite BOOLEAN DEFAULT 0,
      tags TEXT,
      public_id TEXT UNIQUE NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `)

  db.run('CREATE INDEX IF NOT EXISTS idx_memories_user_id ON memories(user_id)')
  db.run('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)')
})

module.exports = db
