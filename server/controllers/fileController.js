const StorageFactory = require('../services/storage/StorageFactory')

const getUploadUrl = async (req, res) => {
  try {
    const { userId } = req.user
    const storageProvider = StorageFactory.getInstance()

    const result = await storageProvider.getUploadUrl(userId, {
      contentType: req.query.contentType,
    })

    res.json(result)
  } catch (error) {
    console.error('Error generating upload URL:', error)
    res.status(500).json({ error: 'Failed to generate upload URL' })
  }
}

const deleteFiles = async (req, res) => {
  try {
    const { fileUrls } = req.body
    if (!Array.isArray(fileUrls)) {
      return res.status(400).json({ error: 'fileUrls must be an array' })
    }

    const storageProvider = StorageFactory.getInstance()
    await storageProvider.deleteFiles(fileUrls)

    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting files:', error)
    res.status(500).json({ error: 'Failed to delete files' })
  }
}

// Helper function to be used by memoryController
const deleteMemoryFiles = async (fileUrls) => {
  if (!Array.isArray(fileUrls) || fileUrls.length === 0) {
    return
  }

  try {
    const storageProvider = StorageFactory.getInstance()
    await storageProvider.deleteFiles(fileUrls)
  } catch (error) {
    console.error('Error deleting memory files:', error)
    // Don't throw the error - we don't want failed file deletion to block memory deletion
  }
}

module.exports = {
  getUploadUrl,
  deleteFiles,
  deleteMemoryFiles,
}
