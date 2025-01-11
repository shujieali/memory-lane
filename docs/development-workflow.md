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
   - Husky 9.1.7
   - Commitlint 19.6.1
   - Lint-staged 15.3.0
   - Prettier 3.4.2

9. Database
   - SQLite for development
   - Auto-creates database file when needed
   - Migrations handled through API initialization
