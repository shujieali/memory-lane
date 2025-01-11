# Memory Lane

A web application that allows users to create, manage, and organize their memories with a rich set of features and customizable interface.

## Features

- **Authentication**:

  - Secure JWT-based authentication
  - User registration and login
  - Protected routes and API endpoints

- **Memory Management**:

  - Create, edit, and delete memories
  - Add tags to organize memories
  - Mark memories as favorites
  - Image loading with skeleton states
  - Responsive grid layout

- **User Interface**:

  - Material-UI v6 components
  - Light/Dark theme switching
  - Collapsible sidebar navigation
  - Compact/Regular view modes
  - Customizable grid layout
  - Show/hide dates and tags

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
   PORT=4001
   JWT_SECRET=your-super-secret-key-change-in-production
   CORS_ORIGIN=http://localhost:5173
   DB_PATH=memories.db
   ```

4. Start development servers:
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:5173
   - Backend: http://localhost:4001

## Technical Stack

### Frontend

- React 19 with TypeScript
- Material-UI v6 for components
- Vite 6 for build tooling
- React Router v7 for navigation
- React Context for state management
- Jest and React Testing Library

### Backend

- Node.js with Express
- SQLite database with indexes
- JWT authentication
- Password hashing with salt
- Rate limiting and CORS
- Input validation

## Development Tools

- **Code Quality**:

  - ESLint 9 with flat config
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
PORT=4001                # Server port
JWT_SECRET=xxx          # JWT signing key
CORS_ORIGIN=xxx        # Allowed frontend origin
DB_PATH=memories.db    # SQLite database path
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
├── server/           # Backend Express/Node.js
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

## Testing

- Run all tests:

  ```bash
  npm test
  ```

- Run specific tests:
  ```bash
  npm test -- MemoryCard
  ```

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
