const express = require('express')
const path = require('path')
const { isPathInside } = require('path-is-inside')

function setupStaticFiles(app) {
  const uploadDir =
    process.env.LOCAL_STORAGE_PATH || path.join(process.cwd(), 'uploads')

  // Security middleware to prevent path traversal
  const secureStatic = (req, res, next) => {
    const filePath = path.join(uploadDir, req.path)
    if (!isPathInside(filePath, uploadDir)) {
      return res.status(403).send('Forbidden')
    }
    next()
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
    res.status(404).send('File not found')
  })
}

module.exports = setupStaticFiles
