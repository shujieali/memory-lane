# Development Workflow

## Prerequisites
- Node.js 20 or higher (required for Vite 6 and ESLint 9)
- npm 8 or higher

## Getting Started
1. Ensure correct Node.js version:
   ```bash
   node --version  # Should be v20+
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development servers:
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

## Code Organization

### Frontend (src/)
- React 19 with TypeScript
- ES Modules for imports/exports
- Vite 6 for development and building
- Tailwind CSS for styling
- ESLint 9 with TypeScript and React rules

### Backend (server/)
- Node.js/Express code
- CommonJS modules
- SQLite database
- ESLint 9 with Node.js rules

## Development Practices

1. Code Style
   - ESLint 9 with flat config system
   - Root-level configuration files:
     - `.eslintrc.mjs` for frontend (TypeScript/React)
     - `.eslintrc.cjs` for backend (Node.js)
   - TypeScript for type safety in frontend

2. Module Systems
   - Frontend: ES Modules (import/export)
   - Backend: CommonJS (require/module.exports)
   - Configuration files use appropriate extensions:
     - `.mjs` for ES Modules (vite.config.mjs, .eslintrc.mjs)
     - `.cjs` for CommonJS (.eslintrc.cjs)

3. Package Versions
   - React 19.0.0
   - Vite 6.0.7
   - ESLint 9.18.0
   - TypeScript ESLint 8.19.1
   - Express 4.21.2
   - SQLite3 5.1.7

4. Database
   - SQLite for development
   - Auto-creates database file when needed
   - Migrations handled through API initialization
