# Module Systems

## Overview
The project uses different module systems for frontend and backend to follow best practices and ecosystem conventions:
- Frontend: ES Modules
- Backend: CommonJS
- Node.js: v20+ required for full compatibility

## Frontend (ES Modules)
- Located in `src/` directory
- Uses ES Modules by default through Vite 6
- Import/export statements for module management
- TypeScript support with ES Module syntax
- React 19 with modern ES Module patterns

### Configuration Files
- `vite.config.mjs`: Uses ES Modules (export default)
- `tailwind.config.js`: Uses ES Modules for Vite compatibility
- `.eslintrc.mjs`: Root-level ESLint config for TypeScript/React (ES Modules)

## Backend (CommonJS)
- Located in `server/` directory
- Uses CommonJS for Node.js compatibility
- require()/module.exports for module management
- Express and SQLite using CommonJS patterns

### Configuration Files
- `.eslintrc.cjs`: Root-level ESLint config for backend (CommonJS)
- `server/package.json`: CommonJS-specific configurations

## Technical Decisions

### Why Different Module Systems?
1. Frontend:
   - ES Modules is the standard in modern frontend development
   - Better compatibility with React 19 and TypeScript ecosystem
   - Vite 6 uses ES Modules by default and requires Node.js 20+

2. Backend:
   - CommonJS is still common in Node.js applications
   - Better compatibility with older Node.js packages
   - Explicit and clear module system separation

### ESLint Configuration
- Two root-level configs:
  - `.eslintrc.mjs`: Handles frontend code with TypeScript/React rules
  - `.eslintrc.cjs`: Handles backend code with Node.js/CommonJS rules
- Using ESLint 9's flat config system
- Requires Node.js 20+ for features like structuredClone

### Node.js Version
- Minimum Node.js 20 required for:
  - Vite 6 compatibility
  - ESLint 9 flat config system
  - Modern JavaScript features
  - Better ES Modules support
