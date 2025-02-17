const crypto = require('crypto')
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3')
const { createPresignedPost } = require('@aws-sdk/s3-presigned-post')
const StorageProvider = require('./StorageProvider')

class S3StorageProvider extends StorageProvider {
  constructor() {
    super()
    this.client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    })
    this.bucket = process.env.S3_BUCKET_NAME
    this.cdnUrl = process.env.MEDIA_CDN_URL
  }

  async getUploadUrl(userId, options = {}) {
    const key = `${userId}/${Date.now()}_${crypto.randomBytes(16).toString('hex')}`
    const params = {
      Bucket: this.bucket,
      Key: key,
      Expires: 60,
      Conditions: [
        [
          'content-length-range',
          0,
          process.env.S3_MAX_CONTENT_SIZE || 104857600,
        ],
        { acl: 'public-read' },
      ],
      Fields: {
        acl: 'public-read',
        'Content-Type': options.contentType || 'application/octet-stream',
      },
    }

    const { url, fields } = await createPresignedPost(this.client, params)
    const fileUrl = `${this.cdnUrl || url}${key}`
    return { url, fields, fileUrl }
  }

  async deleteFile(fileUrl) {
    const key = this.extractKeyFromUrl(fileUrl)
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    })

    try {
      await this.client.send(command)
    } catch (error) {
      console.error(`Failed to delete file from S3: ${fileUrl}`, error)
      throw error
    }
  }

  extractKeyFromUrl(fileUrl) {
    // If we have a CDN URL, remove it from the file URL
    if (this.cdnUrl && fileUrl.startsWith(this.cdnUrl)) {
      return fileUrl.substring(this.cdnUrl.length)
    }

    // If it's a direct S3 URL, extract the key
    const url = new URL(fileUrl)
    const pathParts = url.pathname.split('/')
    return pathParts.slice(2).join('/') // Remove empty string and bucket name
  }
}

module.exports = S3StorageProvider
