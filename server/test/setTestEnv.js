// Set environment variables for testing
process.env.NODE_ENV = 'test'
process.env.DB_PATH = ':memory:' // Use in-memory SQLite database

// Any other test-specific environment variables can be set here
process.env.JWT_SECRET = 'test-secret'
process.env.STORAGE_TYPE = 'local' // Use local storage for tests
process.env.UPLOAD_DIR = '/tmp/test-uploads'
