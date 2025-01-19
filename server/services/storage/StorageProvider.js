/**
 * Abstract base class for storage providers
 */
class StorageProvider {
  /**
   * Generate upload URL for a file
   * @param {string} _userId - User ID for the file owner
   * @param {Object} _options - Upload options (contentLength, contentType, etc.)
   * @returns {Promise<{url: string, fields?: Object, fileUrl: string}>}
   */
  async getUploadUrl(_userId, _options) {
    throw new Error('Not implemented')
  }

  /**
   * Delete a file from storage
   * @param {string} _fileUrl - URL or path of the file to delete
   * @returns {Promise<void>}
   */
  async deleteFile(_fileUrl) {
    throw new Error('Not implemented')
  }

  /**
   * Delete multiple files from storage
   * @param {string[]} fileUrls - Array of file URLs or paths to delete
   * @returns {Promise<void>}
   */
  async deleteFiles(fileUrls) {
    for (const fileUrl of fileUrls) {
      await this.deleteFile(fileUrl)
    }
  }

  /**
   * Extract file key from URL
   * @param {string} _fileUrl - Full URL of the file
   * @returns {string} Key or path of the file
   */
  extractKeyFromUrl(_fileUrl) {
    throw new Error('Not implemented')
  }
}

module.exports = StorageProvider
