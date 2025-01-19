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

### Feature Modules

- Organized in `src/features/` directory
- Each feature is a self-contained module with:
  - Components
  - Types
  - Utils
  - Tests
- Current features:
  - memories: Memory management functionality
  - share: Sharing capabilities

### Configuration Files

- `vite.config.mjs`: Uses ES Modules (export default)
- `.eslintrc.mjs`: Root-level ESLint config for TypeScript/React (ES Modules)
- `commitlint.config.mjs`: Commit message validation
- `scripts/generate-pwa-icons.mjs`: PWA asset generation

## Backend (CommonJS)

- Located in `server/` directory
- Uses CommonJS for Node.js compatibility
- require()/module.exports for module management
- Express and SQLite using CommonJS patterns

### Storage System

- Abstract factory pattern using CommonJS modules
- Located in `server/services/storage/`
- Provider implementations:
  - `LocalStorageProvider.js`
  - `S3StorageProvider.js`
  - `GCPStorageProvider.js`
- Factory and interface:
  - `StorageFactory.js`: Provider instantiation
  - `StorageProvider.js`: Abstract interface

### Configuration Files

- `.eslintrc.cjs`: Root-level ESLint config for backend (CommonJS)
- `server/package.json`: CommonJS-specific configurations

## Service Worker

- Located in `public/sw.js`
- Uses standard JavaScript modules
- Handles offline functionality
- PWA features and caching

## Technical Decisions

### Why Different Module Systems?

1. Frontend:

   - ES Modules is the standard in modern frontend development
   - Better compatibility with React 19 and TypeScript ecosystem
   - Vite 6 uses ES Modules by default and requires Node.js 20+
   - Better support for code splitting and tree shaking

2. Backend:
   - CommonJS is still common in Node.js applications
   - Better compatibility with older Node.js packages
   - Explicit and clear module system separation
   - Simpler implementation of design patterns like abstract factory

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
  - Storage system abstractions
  - PWA functionality
