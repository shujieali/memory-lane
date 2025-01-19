const S3StorageProvider = require('./S3StorageProvider')
const GCPStorageProvider = require('./GCPStorageProvider')
const LocalStorageProvider = require('./LocalStorageProvider')

class StorageFactory {
  /**
   * Create a storage provider instance based on configuration
   * @returns {import('./StorageProvider')} Storage provider instance
   */
  static createProvider() {
    const storageType = process.env.STORAGE_TYPE || 'local'

    switch (storageType.toLowerCase()) {
      case 's3':
        if (
          !process.env.AWS_ACCESS_KEY_ID ||
          !process.env.AWS_SECRET_ACCESS_KEY
        ) {
          throw new Error('AWS credentials not configured')
        }
        return new S3StorageProvider()

      case 'gcp':
        if (!process.env.GCP_PROJECT_ID || !process.env.GCP_KEY_FILE) {
          throw new Error('GCP credentials not configured')
        }
        return new GCPStorageProvider()

      case 'local':
        return new LocalStorageProvider()

      default:
        throw new Error(`Unknown storage type: ${storageType}`)
    }
  }

  // Singleton instance
  static getInstance() {
    if (!StorageFactory.instance) {
      StorageFactory.instance = StorageFactory.createProvider()
    }
    return StorageFactory.instance
  }
}

module.exports = StorageFactory
