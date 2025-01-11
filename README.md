# Memory Lane

A web application that allows users to create and share their memories in a chronological timeline.

## Documentation

- [Project Structure](docs/project-structure.md) - Directory organization and key files
- [Module Systems](docs/module-systems.md) - Frontend/Backend module system configuration
- [Development Workflow](docs/development-workflow.md) - Setup, scripts, and development practices
- [Technical Decisions](docs/technical-decisions.md) - Log of architectural and technical decisions

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development servers:
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
  - React with TypeScript
  - Vite for build tooling
  - Tailwind CSS for styling
  - ES Modules

- Backend:
  - Node.js with Express
  - SQLite database
  - CommonJS modules

## Original Requirements

![Memory lane mockup](./memory_lane.png)

For the original job assessment requirements and mockup, see [Job Assessment Details](docs/assessment.md).
