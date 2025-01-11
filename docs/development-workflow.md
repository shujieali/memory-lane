# Development Workflow

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development servers:
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
- `npm run lint:frontend`: Lint frontend TypeScript/React code
- `npm run lint:backend`: Lint backend Node.js code

### Building
- `npm run build`: Build the frontend application
- `npm run preview`: Preview the built frontend application

## Code Organization

### Frontend (src/)
- TypeScript/React code
- ES Modules for imports/exports
- Tailwind CSS for styling
- ESLint with TypeScript and React rules

### Backend (server/)
- Node.js/Express code
- CommonJS modules
- SQLite database
- ESLint with Node.js rules

## Development Practices
1. Code Style
   - ESLint enforces consistent code style
   - Separate configurations for frontend and backend
   - TypeScript for type safety in frontend

2. Module Systems
   - Frontend: ES Modules (import/export)
   - Backend: CommonJS (require/module.exports)
   - Configuration files use appropriate extensions (.cjs, .mjs)

3. Database
   - SQLite for development
   - Auto-creates database file when needed
   - Migrations handled through API initialization
