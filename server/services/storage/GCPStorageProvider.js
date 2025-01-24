const crypto = require('crypto')
const { Storage } = require('@google-cloud/storage')
const StorageProvider = require('./StorageProvider')

class GCPStorageProvider extends StorageProvider {
  constructor() {
    super()
    this.storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: process.env.GCP_KEY_FILE,
    })
    this.bucket = this.storage.bucket(process.env.GCP_BUCKET_NAME)
    this.cdnUrl = process.env.MEDIA_CDN_URL
  }

  async getUploadUrl(userId, options = {}) {
    const filename = `${Date.now()}_${crypto.randomBytes(16).toString('hex')}`
    const key = `${userId}/${filename}`
    // Define max content length (in bytes)
    const maxContentLength = 10 * 1024 * 1024 // 10 MB

    const conditions = [['content-length-range', 0, maxContentLength]]

    if (options.contentType) {
      conditions.push(['eq', '$Content-Type', options.contentType])
    }

    const [response] = await this.bucket.file(key).generateSignedPostPolicyV4({
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      conditions,
    })

    // Construct the public URL
    const fileUrl = this.cdnUrl
      ? `${this.cdnUrl}${key}`
      : `https://storage.googleapis.com/${this.bucket.name}/${key}`

    return {
      url: response.url,
      fileUrl,
      fields: {
        ...response.fields,
        'Content-Type': options.contentType || 'application/octet-stream',
      },
    }
  }

  async deleteFile(fileUrl) {
    const key = this.extractKeyFromUrl(fileUrl)
    try {
      await this.bucket.file(key).delete()
    } catch (error) {
      // Ignore 404 errors (file not found)
      if (error.code !== 404) {
        console.error(`Failed to delete file from GCP: ${fileUrl}`, error)
        throw error
      }
    }
  }

  async deleteFiles(fileUrls) {
    // Override base implementation to use Promise.all for parallel deletion
    const deletePromises = fileUrls.map((url) => this.deleteFile(url))
    await Promise.all(deletePromises)
  }

  extractKeyFromUrl(fileUrl) {
    // If using CDN URL
    if (this.cdnUrl && fileUrl.startsWith(this.cdnUrl)) {
      return fileUrl.substring(this.cdnUrl.length)
    }

    // If using default GCS URL
    const url = new URL(fileUrl)
    const pathParts = url.pathname.split('/')
    // Remove empty string and bucket name from path
    return pathParts.slice(2).join('/')
  }

  // Helper method to check if a file exists
  async fileExists(key) {
    const [exists] = await this.bucket.file(key).exists()
    return exists
  }

  // Helper method to make a file public
  async makePublic(key) {
    await this.bucket.file(key).makePublic()
  }
}

module.exports = GCPStorageProvider
