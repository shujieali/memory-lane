# Development Workflow

## Prerequisites

- Node.js 20 or higher (required for Vite 6 and ESLint 9)
- npm 8 or higher
- Storage provider credentials (AWS S3, Google Cloud Storage, or local storage)
- SendGrid account for email functionality

## External Service Setup

1. Storage Provider Setup (choose one):

   a. AWS S3:

   - Create an S3 bucket
   - Create IAM user with S3 access
   - Note down access key and secret
   - Configure CORS for your bucket

   b. Google Cloud Storage:

   - Create a GCP project
   - Create a storage bucket
   - Generate service account key
   - Download key file

   c. Local Storage:

   - No setup required
   - Files stored in local filesystem
   - Specify storage directory in env

2. SendGrid Setup:
   - Create SendGrid account
   - Create API key
   - Verify sender email address

## Getting Started

1. Ensure correct Node.js version:

   ```bash
   node --version  # Should be v20+
   ```

2. Configure environment variables:

   ```bash
   # Copy example env file
   cp example.env .env

   # Edit .env with your values:
    # Frontend
    VITE_API_BASE_URL=http://localhost:4001

    # Server Configuration
    DB_PATH=memories.db
    PORT=4001
    BASE_URL=http://localhost:4001
    FRONTEND_URL=http://localhost:5173

    # JWT Configuration
    JWT_SECRET=your-jwt-secret-key

   # Storage Configuration
   STORAGE_TYPE=local # Options: local, s3, gcp

   # If using local storage:
   LOCAL_STORAGE_PATH=uploads

    # CDN URL Configuration (optional)
    MEDIA_CDN_URL=http://localhost:4001

   # If using AWS S3:
   AWS_ACCESS_KEY_ID=your-aws-access-key-id
   AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
   AWS_REGION=your-aws-region
   S3_BUCKET_NAME=your-s3-bucket-name
    S3_MAX_CONTENT_SIZE=104857600 # 100MB in bytes

   # If using Google Cloud Storage:
   GCP_PROJECT_ID=your-project-id
   GCP_KEY_FILE=path/to/service-account-key.json
   GCP_BUCKET_NAME=your-bucket-name

   # Email Configuration (SendGrid)
   SENDGRID_API_KEY=your-sendgrid-api-key
    FROM_EMAIL=noreply@yourdomain.com
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start development servers:
   ```bash
   npm run dev
   ```
   This will start:
   - Frontend: Vite dev server at http://localhost:5173
   - Backend: Express API at http://localhost:4001

## Available Scripts

### Development

- `npm run dev`: Start both frontend and backend in development mode
- `npm run dev:frontend`: Start only the frontend Vite server
- `npm run dev:backend`: Start only the backend API server

### Linting

- `npm run lint`: Run ESLint for both frontend and backend
- `npm run lint:frontend`: Lint frontend TypeScript/React code using `.eslintrc.mjs`
- `npm run lint:backend`: Lint backend Node.js code using `.eslintrc.cjs`

### Building

- `npm run build`: Build the frontend application
- `npm run preview`: Preview the built frontend application
- `npm run generate-pwa-icons`: Generate PWA icons from source image

## Code Organization

### Frontend (src/)

- React 19 with TypeScript
- ES Modules for imports/exports
- Vite 6 for development and building
- Material-UI v6 for components
- ESLint 9 with TypeScript and React rules
- PWA support with service worker

### Backend (server/)

- Node.js/Express code
- CommonJS modules
- SQLite database
- Multiple storage providers
- ESLint 9 with Node.js rules

## Development Practices

1. Version Management

   - Node.js version managed via `.nvmrc`
   - ASDF support via `.tool-versions`
   - Ensures consistent Node.js version (20.18.0) across team

2. Code Style & Quality

   - ESLint 9 with flat config system
   - Root-level configuration files:
     - `.eslintrc.mjs` for frontend (TypeScript/React)
     - `.eslintrc.cjs` for backend (Node.js)
   - TypeScript for type safety in frontend
   - Prettier for consistent code formatting
   - EditorConfig for basic editor settings

3. Git Workflow

   - Conventional Commits (enforced by commitlint)
   - Pre-commit hooks via husky:
     - Lint-staged for running ESLint and Prettier
     - Commitlint for commit message validation
   - Pull request template for standardized reviews
   - Issue templates for bugs and feature requests
   - Automated code ownership via CODEOWNERS

4. Commit Guidelines

   Using commitlint with conventional commits standard:

   - Format: `type(scope?): subject`
   - Types:
     - `feat`: New features
     - `fix`: Bug fixes
     - `docs`: Documentation changes
     - `style`: Code style changes (formatting, etc.)
     - `refactor`: Code refactoring
     - `test`: Adding or modifying tests
     - `chore`: Maintenance tasks
   - Example commits:
     ```bash
     feat: add user authentication
     fix(api): handle timeout errors
     docs: update README
     style: format code
     ```

5. Pre-commit Workflow

   Using husky and lint-staged:

   - Automatically runs on `git commit`
   - Lints and formats staged files:
     - ESLint for `.ts`/`.tsx` files
     - Prettier for `.js`, `.jsx`, `.ts`, `.tsx`, `.json`, `.css`, `.md`
   - Validates commit messages using commitlint
   - CI-safe with `is-ci` integration

6. VSCode Integration

   - Consistent editor settings via .vscode/settings.json
   - Recommended extensions in .vscode/extensions.json:
     - ESLint and Prettier integration
     - Git tools (GitLens)
     - Development helpers (Path Intellisense, Import Cost)
     - TypeScript support (Pretty TS Errors)
     - Code review tools (Color Highlight, TODO Highlight)

7. Continuous Integration

   - GitHub Actions workflow runs on push to main and pull requests
   - Automated steps:
     - Dependency installation
     - Linting
     - PR title validation (conventional commits)

8. Package Versions

   - React 19.0.0
   - Vite 6.0.7
   - ESLint 9.18.0
   - TypeScript ESLint 8.19.1
   - Express 4.21.2
   - SQLite3 5.1.7
   - Material-UI v6.3.1
   - @google-cloud/storage 7.15.0
   - react-dropzone 14.3.5
   - notistack 3.0.1
   - multer 1.4.5-lts.1
   - sharp 0.33.5
   - Husky 9.1.7
   - Commitlint 19.6.1
   - Lint-staged 15.3.0
   - Prettier 3.4.2

9. Database

   - SQLite for development
   - Auto-creates database file when needed
   - Migrations for schema updates:
     - Run `node server/migrate.js` for new changes
     - Current migrations:
       - Initial schema creation
       - Add image_urls column for multi-image support

10. External Services

    - Storage Providers:
      a. AWS S3:

      - Pre-signed URLs for secure uploads
      - CORS configuration required
      - Content size limits enforced
      - Optional CDN support

      b. Google Cloud Storage:

      - Service account authentication
      - Bucket permissions setup
      - Optional CDN configuration

      c. Local Storage:

      - File system storage
      - Directory permissions setup
      - Development-friendly option

    - SendGrid for email:
      - API key required in .env
      - Verified sender address needed
      - Email templates for sharing

11. PWA Development

    - Service worker in public/sw.js
    - Manifest configuration in public/manifest.json
    - Icon generation script for different sizes
    - Offline functionality support
    - Add to home screen capability
