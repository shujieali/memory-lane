const fs = require('fs/promises')
const path = require('path')
const crypto = require('crypto')
const { isPathInside } = require('path-is-inside')
const StorageProvider = require('./StorageProvider')

class LocalStorageProvider extends StorageProvider {
  constructor() {
    super()
    this.uploadDir =
      process.env.LOCAL_STORAGE_PATH || path.join(process.cwd(), 'uploads')
    this.baseUrl = process.env.BASE_URL || 'http://localhost:3000'
  }

  async ensureUploadDir() {
    try {
      await fs.access(this.uploadDir)
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.mkdir(this.uploadDir, { recursive: true })
      } else {
        throw error
      }
    }
  }

  validatePath(filePath) {
    const normalizedPath = path.normalize(filePath)
    if (!isPathInside(normalizedPath, this.uploadDir)) {
      throw new Error('Invalid file path: Path traversal detected')
    }
    return normalizedPath
  }

  async getUploadUrl(userId, options = {}) {
    await this.ensureUploadDir()

    const userDir = path.join(this.uploadDir, userId)
    await fs.mkdir(userDir, { recursive: true })

    const filename = `${Date.now()}_${crypto.randomBytes(16).toString('hex')}`
    const key = `${userId}/${filename}`
    const fileUrl = `${this.baseUrl}/uploads/${key}`

    return {
      url: `${this.baseUrl}/api/upload`,
      fields: {
        key,
        userId,
        timestamp: Date.now(),
        contentType: options.contentType || 'application/octet-stream',
      },
      fileUrl,
    }
  }

  async deleteFile(fileUrl) {
    const key = this.extractKeyFromUrl(fileUrl)
    const filePath = this.validatePath(path.join(this.uploadDir, key))

    try {
      await fs.unlink(filePath)
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error(`Failed to delete local file: ${filePath}`, error)
        throw error
      }
    }

    // Clean up empty directories
    await this.cleanupEmptyDirs(path.dirname(filePath))
  }

  async deleteFiles(fileUrls) {
    const deletePromises = fileUrls.map((url) => this.deleteFile(url))
    await Promise.allSettled(deletePromises)
  }

  async cleanupEmptyDirs(dirPath) {
    if (!isPathInside(dirPath, this.uploadDir) || dirPath === this.uploadDir) {
      return
    }

    try {
      const files = await fs.readdir(dirPath)
      if (files.length === 0) {
        await fs.rmdir(dirPath)
        // Recursively check parent directory
        await this.cleanupEmptyDirs(path.dirname(dirPath))
      }
    } catch (error) {
      console.error(`Error cleaning up directory ${dirPath}:`, error)
    }
  }

  extractKeyFromUrl(fileUrl) {
    const url = new URL(fileUrl)
    const urlPath = url.pathname.replace(/^\/uploads\//, '')
    return decodeURIComponent(urlPath)
  }

  // Helper method to get the full file path with validation
  getFilePath(key) {
    return this.validatePath(path.join(this.uploadDir, key))
  }

  // Helper method to get file stats with validation
  async getFileStats(key) {
    const filePath = this.getFilePath(key)
    try {
      return await fs.stat(filePath)
    } catch (error) {
      if (error.code === 'ENOENT') {
        return null
      }
      throw error
    }
  }
}

module.exports = LocalStorageProvider
