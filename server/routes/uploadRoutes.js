const express = require('express')
const multer = require('multer')
const { getUploadUrl, deleteFiles } = require('../controllers/fileController')
const { authenticateToken } = require('../utils/auth')

const router = express.Router()

// Protected routes - require authentication
router.use(authenticateToken)

// Generate upload URL
router.get('/url', getUploadUrl)

// Delete files
router.post('/delete', deleteFiles)

// Handle file upload for local storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    if (process.env.STORAGE_TYPE === 'local') {
      const uploadDir = process.env.LOCAL_STORAGE_PATH || 'uploads'
      const fullPath = `${uploadDir}/${req.body.key}`
      cb(null, fullPath)
    } else {
      cb(new Error('Direct upload only supported for local storage'))
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.S3_MAX_CONTENT_SIZE || '104857600'), // 100MB default
  },
})

// Handle direct file upload (only used by local storage)
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    // Return the full URL to the uploaded file
    const baseUrl =
      process.env.BASE_URL || `http://localhost:${process.env.PORT || 4001}`
    const fileUrl = `${baseUrl}/uploads/${req.body.key}`
    res.json({ success: true, fileUrl })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Upload failed' })
  }
})

module.exports = router
