# Project Structure

## Overview

The project is organized into two main parts:

- Frontend (src/): React 19/TypeScript application using Vite 6 and Material-UI
- Backend (server/): Express/Node.js API with SQLite database and JWT authentication

## Directory Structure

```
memory-lane/
├── docs/                    # Project documentation
│   ├── assessment.md       # Original job assessment requirements
│   ├── deployment.md       # Deployment and hosting guide
│   ├── development-workflow.md # Development practices
│   ├── module-systems.md   # Module configuration
│   ├── project-structure.md # This file
│   └── technical-decisions.md # Architecture decisions log
├── public/                 # Static public assets
│   ├── icons/             # Application icons
│   │   ├── icon-192x192.png  # PWA icons
│   │   ├── icon-512x512.png
│   │   ├── memorylane.ico
│   │   └── memorylane.png
│   ├── manifest.json      # PWA manifest
│   └── sw.js             # Service worker
├── scripts/               # Build and utility scripts
│   └── generate-pwa-icons.mjs # PWA icon generation
├── server/                # Backend source code (CommonJS)
│   ├── api.js            # Express app setup
│   ├── controllers/      # Route controllers
│   │   ├── authController.js    # Authentication logic
│   │   ├── emailController.js   # Email notifications
│   │   ├── fileController.js    # File upload handling
│   │   ├── memoryController.js  # Memory operations
│   │   ├── seoController.js     # SEO optimization
│   │   └── uploadController.js  # Upload management
│   ├── middleware/       # Express middleware
│   │   ├── socialBotDetector.js # Bot detection
│   │   └── staticFiles.js      # Static file serving
│   ├── routes/          # API route definitions
│   │   ├── authRoutes.js      # Auth endpoints
│   │   ├── emailRoutes.js     # Email endpoints
│   │   ├── memoryRoutes.js    # Memory endpoints
│   │   ├── socialRoutes.js    # Social sharing
│   │   └── uploadRoutes.js    # Upload endpoints
│   ├── services/        # Business logic services
│   │   └── storage/     # Storage providers
│   │       ├── GCPStorageProvider.js  # Google Cloud Storage
│   │       ├── LocalStorageProvider.js # Local filesystem
│   │       ├── S3StorageProvider.js   # AWS S3
│   │       ├── StorageFactory.js      # Provider factory
│   │       └── StorageProvider.js     # Base interface
│   └── utils/           # Utility functions
│       ├── auth.js      # Authentication helpers
│       ├── db.js        # Database operations
│       └── validation.js # Input validation
├── src/                  # Frontend source code (ES Modules)
│   ├── App.tsx          # Main React component
│   ├── assets/          # Frontend assets
│   │   └── anonymous.svg # Anonymous user icon
│   ├── components/      # Reusable components
│   │   ├── AppHeader/   # Application header
│   │   ├── DeleteConfirmDialog/ # Delete confirmation
│   │   ├── ImageUploader/      # Image upload UI
│   │   ├── NavigationDrawer/   # Side navigation
│   │   ├── ScrollIndicator/    # Scroll position
│   │   ├── Search/            # Search functionality
│   │   ├── Sort/             # Sorting controls
│   │   ├── StatusIndicator/  # Online/offline status
│   │   ├── Transitions/      # Animation components
│   │   └── UploadArea/       # Drag-drop upload
│   ├── context/         # React contexts
│   │   ├── __tests__/  # Context tests
│   │   ├── authContext.tsx    # Auth state
│   │   ├── settingsContext.tsx # User settings
│   │   └── shareContext.tsx   # Sharing state
│   ├── features/        # Feature modules
│   │   ├── memories/    # Memory management
│   │   │   ├── components/    # Memory components
│   │   │   └── types/        # Memory types
│   │   └── share/      # Sharing functionality
│   │       ├── components/    # Share components
│   │       └── types/        # Share types
│   ├── hooks/          # Custom React hooks
│   │   ├── useAuth.ts        # Auth hook
│   │   ├── useOfflineDetection.ts # Offline state
│   │   ├── useScrollDetection.ts  # Scroll position
│   │   └── useShare.ts      # Share functionality
│   ├── layouts/        # Layout components
│   │   ├── MainLayout.tsx   # Main app layout
│   │   └── PublicLayout.tsx # Public pages layout
│   ├── pages/          # Page components
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── Login.tsx       # Login page
│   │   ├── Memories.tsx    # Memories list
│   │   ├── MemoryDetail.tsx # Single memory
│   │   ├── Offline.tsx     # Offline state
│   │   ├── PublicMemory.tsx # Shared memory
│   │   ├── Settings.tsx    # User settings
│   │   └── Surprise.tsx    # Random memory
│   ├── Routes/         # Routing configuration
│   │   ├── AppRoutes.tsx   # Route definitions
│   │   ├── guards.tsx      # Route protection
│   │   └── utils.ts       # Routing utilities
│   ├── services/       # API services
│   │   ├── api.ts         # API client
│   │   └── auth.ts        # Auth service
│   ├── theme/          # UI theming
│   │   ├── components.ts   # Component styles
│   │   ├── palette.ts     # Color schemes
│   │   └── typography.ts  # Text styles
│   ├── types/          # TypeScript types
│   │   ├── memory.ts      # Memory types
│   │   ├── user.ts        # User types
│   │   └── ...           # Other type definitions
│   └── utils/          # Utility functions
│       ├── apiUtils.ts    # API helpers
│       ├── imageUtils.ts  # Image processing
│       └── __tests__/    # Utility tests
└── [Configuration Files]
    ├── .editorconfig     # Editor settings
    ├── .env.production   # Production env vars
    ├── .eslintrc.cjs    # Backend ESLint
    ├── .eslintrc.mjs    # Frontend ESLint
    ├── .gitignore       # Git ignore rules
    ├── .npmrc           # npm configuration
    ├── .nvmrc           # Node version
    ├── .prettierrc      # Code formatting
    ├── .tool-versions   # ASDF version manager
    ├── commitlint.config.mjs # Commit message rules
    ├── example.env      # Environment template
    ├── jest.config.js   # Test configuration
    ├── package.json     # Project manifest
    ├── tsconfig.json    # TypeScript config
    ├── tsconfig.node.json # Node TypeScript
    └── vite.config.mjs  # Vite configuration
```

## Key Features

### Frontend

- **Authentication**:

  - JWT-based authentication
  - Protected routes
  - Login/Signup flows

- **Memory Management**:

  - Create, read, update, delete memories
  - Multi-image support with carousel
  - Drag-and-drop file uploads
  - Upload progress indicators
  - Favorite memories
  - Tags support
  - Responsive grid layout
  - Infinite scroll pagination
  - Search and filtering

- **User Interface**:

  - Material-UI v6 components
  - Responsive sidebar navigation
  - Light/Dark theme switching
  - Compact view mode
  - Customizable grid layout
  - Show/hide dates and tags
  - Toast notifications

- **Settings**:
  - Theme preferences
  - Display settings
  - Layout customization
  - Persistent settings storage

### Backend

- **Security**:

  - JWT authentication
  - Password hashing with salt
  - Rate limiting
  - CORS configuration
  - Input validation
  - User ownership verification

- **Storage System**:

  - Multiple storage provider support
  - AWS S3 integration
  - Google Cloud Storage
  - Local file system storage
  - Factory pattern for provider selection
  - CDN support

- **Database**:

  - SQLite with foreign key constraints
  - Indexed queries
  - Transaction support
  - Proper error handling

- **API Features**:
  - RESTful endpoints
  - Memory CRUD operations
  - User authentication
  - Tag management
  - Favorites system
  - Social sharing

## Configuration

### Environment Variables (.env)

The application uses the following environment variables:

```
# Frontend Configuration
VITE_API_BASE_URL=http://localhost:4001  # Frontend API base URL

# Server Configuration
DB_PATH=memories.db      # SQLite database path
PORT=4001               # Server port
BASE_URL=http://localhost:4001  # Backend base URL
FRONTEND_URL=http://localhost:5173  # Frontend URL (for CORS)

# JWT Configuration
JWT_SECRET=your-jwt-secret-key  # JWT signing secret

# Storage Configuration
STORAGE_TYPE=local      # Options: local, s3, gcp

# Local Storage (if STORAGE_TYPE=local)
LOCAL_STORAGE_PATH=uploads  # Upload directory path

# CDN Configuration (optional)
MEDIA_CDN_URL=http://localhost:4001  # CDN base URL

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=your-aws-region
S3_BUCKET_NAME=your-s3-bucket-name
S3_MAX_CONTENT_SIZE=104857600  # 100MB in bytes

# Google Cloud Storage Configuration
GCP_PROJECT_ID=your-project-id
GCP_KEY_FILE=path/to/service-account-key.json
GCP_BUCKET_NAME=your-bucket-name

# Email Configuration (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@yourdomain.com
```

### Development Tools

- **Code Quality**:

  - ESLint 9 with flat config
  - Prettier for formatting
  - TypeScript for type safety
  - Jest and React Testing Library
  - EditorConfig for consistency

- **State Management**:

  - React Context for auth and settings
  - Local storage persistence
  - JWT token management

- **Build Tools**:
  - Vite 6 for frontend
  - TypeScript compiler
  - Material-UI for styling

## Requirements

- Node.js 20+ required for:
  - Vite 6 compatibility
  - ESLint 9 flat config
  - Modern JavaScript features
  - Material-UI v6

## Development Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create .env file with required variables

3. Start development servers:

   ```bash
   npm run dev
   ```

4. Access the application:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:4001
