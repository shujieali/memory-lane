const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const path = require('path')

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Memory Lane API',
      version: '1.0.0',
      description: 'API documentation for Memory Lane application',
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:4001',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints',
      },
      {
        name: 'Memories',
        description: 'Memory management endpoints',
      },
      {
        name: 'Storage',
        description: 'File storage and upload endpoints',
      },
      {
        name: 'Email',
        description: 'Email sending endpoints',
      },
      {
        name: 'Social',
        description: 'Social sharing endpoints',
      },
      {
        name: 'Public Memories',
        description: 'Public memory access endpoints',
      },
    ],
  },
  apis: [
    // Use absolute paths to ensure Swagger finds the files
    path.resolve(__dirname, './routes/*.js'),
    path.resolve(__dirname, './routes/authRoutes.js'),
    path.resolve(__dirname, './routes/memoryRoutes.js'),
    path.resolve(__dirname, './routes/uploadRoutes.js'),
    path.resolve(__dirname, './routes/emailRoutes.js'),
    path.resolve(__dirname, './routes/socialRoutes.js'),
  ],
  // Enable Swagger features
  explorer: true,
}

const specs = swaggerJsdoc(options)

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
  }),
  specs,
}
