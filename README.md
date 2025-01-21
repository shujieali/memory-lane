[![CI](https://github.com/shujieali/memory-lane/actions/workflows/ci.yml/badge.svg)](https://github.com/shujieali/memory-lane/actions/workflows/ci.yml)

# Memory Lane

A web application that allows users to create, manage, and organize their memories with a rich set of features and customizable interface.

## Features

- **Authentication**:

  - Secure JWT-based authentication
  - User registration and login
  - Protected routes and API endpoints

- **Memory Management**:

  - Create, edit, and delete memories
  - Multi-image support with carousel
  - Drag-and-drop file uploads
  - Upload progress indicators
  - Add tags to organize memories
  - Mark memories as favorites
  - Image loading with skeleton states
  - Responsive grid layout
  - Surprise memories on home page
  - Chronological timeline view
  - Search and filter capabilities
  - Infinite scroll pagination

- **Storage System**:

  - Multiple storage provider support
  - AWS S3 integration
  - Google Cloud Storage
  - Local file system storage
  - Optional CDN configuration
  - Flexible provider switching

- **User Interface**:

  - Material-UI v6 components
  - Light/Dark theme switching
  - Collapsible sidebar navigation
  - Compact/Regular view modes
  - Customizable grid layout
  - Show/hide dates and tags
  - Toast notifications
  - Progressive Web App (PWA) support
  - Add to home screen capability

- **Sharing & Social**:

  - Email sharing system via SendGrid
  - Anonymous memory viewing
  - Social media meta tags
  - Social bot detection
  - SEO optimization

- **Settings**:
  - Theme preferences
  - Display customization
  - Layout options
  - Persistent user preferences

## Prerequisites

- Node.js 20.18.0 (version managed via .nvmrc and .tool-versions)
- npm 8 or higher

## Documentation

- [Project Structure](docs/project-structure.md) - Directory organization and key files
- [Module Systems](docs/module-systems.md) - Frontend/Backend module system configuration
- [Development Workflow](docs/development-workflow.md) - Setup, tooling, and development practices
- [Technical Decisions](docs/technical-decisions.md) - Log of architectural and technical decisions
- [Deployment Guide](docs/deployment.md) - Production deployment instructions
- [Testing Guide](docs/testing.md) - Testing infrastructure and practices

## Quick Start

1. Ensure correct Node.js version:

   ```bash
   node --version  # Should be v20+
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create .env file:

   ```env
   # Server Configuration
   PORT=4001
   JWT_SECRET=your-super-secret-key-change-in-production
   CORS_ORIGIN=http://localhost:5173
   BASE_URL=http://localhost:4001
   FRONTEND_URL=http://localhost:5173

   # Storage Configuration (choose one)
   STORAGE_TYPE=local  # Options: local, s3, gcp
   LOCAL_STORAGE_PATH=uploads
   ```

4. Start development servers:
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:5173
   - Backend: http://localhost:4001
   - API Documentation: http://localhost:4001/api-docs

## Technical Stack

### Frontend

- React 19 with TypeScript
- Material-UI v6 for components
- Vite 6 for build tooling
- React Router v7 for navigation
- React Context with custom hooks
- Centralized context definitions
- Jest and React Testing Library
- React Dropzone for file uploads
- PWA support with service worker
- Offline functionality
- SEO optimization

### Backend

- Node.js with Express
- SQLite database with indexes
- JWT authentication
- Password hashing with salt
- Rate limiting and CORS
- Input validation
- Multiple storage providers
- Factory pattern for storage
- SEO optimization
- Swagger/OpenAPI documentation
- SendGrid email integration
- Social bot detection

## Development Tools

- **Code Quality**:

  - ESLint 9 with flat config
  - Separate frontend/backend ESLint rules
  - Console usage allowed in server code
  - Proper error handling configuration
  - Prettier for formatting
  - TypeScript for type safety
  - EditorConfig for consistency

- **Git Workflow**:
  - Husky for Git hooks
  - Commitlint for commit messages
  - Lint-staged for pre-commit checks
  - GitHub Actions for CI/CD

## Configuration

### Environment Variables

```env
# Frontend
VITE_API_BASE_URL=http://localhost:4001

# Server Configuration
PORT=4001
CORS_ORIGIN=http://localhost:5173
API_BASE_URL=http://localhost:4001
DB_PATH=memories.db
BASE_URL=http://localhost:4001
FRONTEND_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=your-super-secret-key-change-in-production

# Storage Configuration
STORAGE_TYPE=s3 # Options: local, s3, gcp

# Local Storage Configuration (if STORAGE_TYPE=local)
LOCAL_STORAGE_PATH=uploads

# CDN URL Configuration
MEDIA_CDN_URL=your-cdn-url

# AWS S3 Configuration (if STORAGE_TYPE=s3)
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=your-aws-region
S3_BUCKET_NAME=your-s3-bucket-name
S3_MAX_CONTENT_SIZE=104857600

# Google Cloud Storage Configuration (if STORAGE_TYPE=gcp)
GCP_PROJECT_ID=your-project-id
GCP_KEY_FILE=path/to/service-account-key.json
GCP_BUCKET_NAME=your-bucket-name

# Email Configuration
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=your-email-from
```

### Build Configuration

- `.eslintrc.mjs` - Frontend TypeScript/React rules
- `.eslintrc.cjs` - Backend Node.js rules
- `vite.config.mjs` - Vite configuration
- `tsconfig.json` - TypeScript configuration

## Project Structure

```
memory-lane/
├── src/              # Frontend React/TypeScript
│   ├── context/     # Context providers and definitions
│   ├── hooks/       # Custom React hooks
│   └── ...          # Other frontend directories
├── server/           # Backend Express/Node.js
│   ├── services/    # Including storage providers
│   └── ...          # Other backend directories
├── docs/            # Documentation
└── [config files]   # Configuration files
```

See [Project Structure](docs/project-structure.md) for detailed organization.

## Development Workflow

1. Start development servers with `npm run dev`
2. Make changes to frontend (src/) or backend (server/)
3. Changes are automatically reloaded
4. Commits are checked for style and messages
5. Tests run automatically in CI

## Deployment

See [Deployment Guide](docs/deployment.md) for detailed instructions on:

- Setting up EC2 instances
- Configuring PM2 process management
- Database setup and permissions
- Storage provider configuration
- Security considerations
- Maintenance procedures

## Testing

The project includes comprehensive testing at multiple levels:

### Unit Tests (Jest)

```bash
# Run all tests
npm test

# Run frontend tests only
npm run test:frontend

# Run backend tests only
npm run test:backend

# Run tests with coverage
npm run test:coverage
```

### End-to-End Tests (Playwright)

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in debug mode
npm run test:e2e:debug
```

### API Documentation & Testing

- Interactive API documentation available at `/api-docs` endpoint
- Built with Swagger/OpenAPI
- Includes request/response examples
- Authentication details
- Schema definitions

See [Testing Guide](docs/testing.md) for detailed testing documentation.

## Original Requirements

This project was created as part of a job assessment task. The original requirements included:

- Create a web application that allows users to create and share their memories in a chronological timeline
- Each memory should include:
  - Title
  - Description
  - Timestamp
  - Image(s)
- Simple sharing mechanism

![Memory lane mockup](./memory_lane.png)

For the original job assessment requirements and mockup, see [Job Assessment Details](docs/assessment.md).
