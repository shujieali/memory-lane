const fs = require('fs/promises')
const path = require('path')
const crypto = require('crypto')
const StorageProvider = require('./StorageProvider')

class LocalStorageProvider extends StorageProvider {
  constructor() {
    super()
    this.uploadDir =
      process.env.LOCAL_STORAGE_PATH || path.join(process.cwd(), 'uploads')
    this.baseUrl =
      process.env.BASE_URL || `http://localhost:${process.env.PORT || 4001}`
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
    const relative = path.relative(this.uploadDir, normalizedPath)

    // Check if path attempts to traverse outside upload directory
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
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
      url: `${this.baseUrl}/api/storage/upload`,
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
    try {
      const key = this.extractKeyFromUrl(fileUrl)
      const filePath = this.validatePath(path.join(this.uploadDir, key))

      // Check if file exists before attempting deletion
      try {
        await fs.access(filePath)
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log(`File already deleted or doesn't exist: ${filePath}`)
          return
        }
        throw error
      }

      // Attempt to delete the file
      try {
        await fs.unlink(filePath)
        console.log(`Successfully deleted file: ${filePath}`)
      } catch (error) {
        console.error(`Failed to delete local file: ${filePath}`, error)
        throw error
      }

      // Clean up empty directories
      await this.cleanupEmptyDirs(path.dirname(filePath))
    } catch (error) {
      console.error('Error in deleteFile:', error)
      throw error
    }
  }

  async deleteFiles(fileUrls) {
    const deletePromises = fileUrls.map((url) => this.deleteFile(url))
    await Promise.allSettled(deletePromises)
  }

  async cleanupEmptyDirs(dirPath) {
    // Check if path is within upload directory
    const relative = path.relative(this.uploadDir, dirPath)
    if (
      relative.startsWith('..') ||
      path.isAbsolute(relative) ||
      dirPath === this.uploadDir
    ) {
      return
    }

    try {
      // Check if directory exists
      try {
        await fs.access(dirPath)
      } catch (error) {
        if (error.code === 'ENOENT') {
          return // Directory doesn't exist, nothing to clean
        }
        throw error
      }

      // Read directory contents
      const files = await fs.readdir(dirPath)

      // If directory is empty, remove it and check parent
      if (files.length === 0) {
        try {
          await fs.rmdir(dirPath)
          console.log(`Removed empty directory: ${dirPath}`)
          // Recursively check parent directory
          const parentDir = path.dirname(dirPath)
          if (parentDir !== this.uploadDir) {
            await this.cleanupEmptyDirs(parentDir)
          }
        } catch (error) {
          if (error.code !== 'ENOENT') {
            console.error(`Failed to remove directory ${dirPath}:`, error)
            throw error
          }
        }
      }
    } catch (error) {
      console.error(`Error cleaning up directory ${dirPath}:`, error)
      // Don't throw the error as this is a cleanup operation
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
