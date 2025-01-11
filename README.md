# Memory Lane

A web application that allows users to create and share their memories in a chronological timeline.

## Prerequisites

- Node.js 20.18.0 (version managed via .nvmrc and .tool-versions)
- npm 8 or higher

## Documentation

- [Project Structure](docs/project-structure.md) - Directory organization and key files
- [Module Systems](docs/module-systems.md) - Frontend/Backend module system configuration
- [Development Workflow](docs/development-workflow.md) - Setup, tooling, and development practices
- [Technical Decisions](docs/technical-decisions.md) - Log of architectural and technical decisions

## Development Tools

- Version Management: NVM and ASDF support
- Code Quality: ESLint, Prettier, EditorConfig
- Git Workflow: Husky, Commitlint, Lint-staged
- CI/CD: GitHub Actions for linting and testing
- VSCode: Configured settings and recommended extensions
- Templates: PR, Issue, and Bug report templates

## Quick Start

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
   - Frontend: http://localhost:5173
   - Backend: http://localhost:4001

## Project Overview

Memory Lane helps users share their memories with friends and family in a single place. Features include:

- Chronological timeline of events
- Each memory includes:
  - Title
  - Description
  - Timestamp
  - Image(s)
- Simple sharing mechanism

## Technical Stack

- Frontend:

  - React 19 with TypeScript
  - Vite 6 for build tooling
  - Tailwind CSS for styling
  - ES Modules
  - ESLint 9 with TypeScript/React rules

- Backend:
  - Node.js with Express 4.21
  - SQLite 5.1 database
  - CommonJS modules
  - ESLint 9 with Node.js rules

## Configuration

- ESLint:
  - `.eslintrc.mjs` - Frontend TypeScript/React rules
  - `.eslintrc.cjs` - Backend Node.js rules
- Build Tools:
  - `vite.config.mjs` - Vite configuration
  - `tailwind.config.js` - Tailwind CSS configuration
  - `tsconfig.json` - TypeScript configuration

## Original Requirements

![Memory lane mockup](./memory_lane.png)

For the original job assessment requirements and mockup, see [Job Assessment Details](docs/assessment.md).
