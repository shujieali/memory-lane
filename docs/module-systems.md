# Module Systems

## Overview
The project uses different module systems for frontend and backend to follow best practices and ecosystem conventions:
- Frontend: ES Modules
- Backend: CommonJS

## Frontend (ES Modules)
- Located in `src/` directory
- Uses ES Modules by default through Vite
- Import/export statements for module management
- TypeScript support with ES Module syntax

### Configuration Files
- `vite.config.ts`: Uses ES Modules (export default)
- `tailwind.config.js`: Uses ES Modules for Vite compatibility
- `src/.eslintrc.cjs`: Uses CommonJS (required by ESLint)

## Backend (CommonJS)
- Located in `server/` directory
- Uses CommonJS for Node.js compatibility
- Explicit CommonJS configuration in `server/package.json`
- require()/module.exports for module management

### Configuration Files
- `server/.eslintrc.cjs`: Uses CommonJS
- `server/package.json`: Sets `"type": "commonjs"` explicitly

## Technical Decisions

### Why Different Module Systems?
1. Frontend:
   - ES Modules is the standard in modern frontend development
   - Better compatibility with React and TypeScript ecosystem
   - Vite uses ES Modules by default

2. Backend:
   - CommonJS is still common in Node.js applications
   - Better compatibility with older Node.js packages
   - Explicit and clear module system through package.json

### Configuration Files
- ESLint configs use .cjs extension as ESLint requires CommonJS
- Build tool configs (Vite, Tailwind) use ES Modules for better integration
