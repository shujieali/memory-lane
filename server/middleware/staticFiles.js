const express = require('express')
const path = require('path')
const fs = require('fs')

function setupStaticFiles(app) {
  const uploadDir =
    process.env.LOCAL_STORAGE_PATH || path.join(process.cwd(), 'uploads')

  // Create uploads directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
    console.log(`Created upload directory: ${uploadDir}`)
  }

  // Security middleware to prevent path traversal
  const secureStatic = (req, res, next) => {
    try {
      const filePath = path.join(uploadDir, req.path)
      const relativePath = path.relative(uploadDir, filePath)

      // Check if path attempts to traverse outside upload directory
      if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
        return res.status(403).json({
          error: 'Access forbidden: Invalid file path',
        })
      }

      // Check if file exists and is accessible
      if (fs.existsSync(filePath)) {
        try {
          fs.accessSync(filePath, fs.constants.R_OK)
        } catch (err) {
          console.error(`File permission error: ${err.message}`)
          return res.status(500).json({
            error: 'Server error: Unable to access file',
          })
        }
      }

      next()
    } catch (err) {
      console.error(`Static files error: ${err.message}`)
      return res.status(500).json({
        error: 'Server error processing file request',
      })
    }
  }

  // Serve files from upload directory under /uploads route
  app.use(
    '/uploads',
    secureStatic,
    express.static(uploadDir, {
      index: false, // Disable directory listing
      dotfiles: 'deny', // Don't serve dotfiles
      fallthrough: true, // Continue to next middleware if file not found
    }),
  )

  // Handle 404 for files
  app.use('/uploads', (req, res) => {
    res.status(404).json({
      error: 'File not found',
    })
  })
}

module.exports = setupStaticFiles
