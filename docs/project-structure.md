# Project Structure

## Overview

The project is organized into two main parts:

- Frontend (src/): React 19/TypeScript application using Vite 6
- Backend (server/): Express/Node.js API with SQLite database

## Directory Structure

```
memory-lane/
├── src/                    # Frontend source code (ES Modules)
│   ├── assets/             # Static assets
│   ├── App.tsx             # Main React component
│   └── main.tsx            # Application entry point
├── server/                 # Backend source code (CommonJS)
│   ├── api.js              # Express API implementation
│   └── package.json        # Backend-specific dependencies
├── public/                 # Public static files
├── docs/                   # Project documentation
├── .github/                # GitHub configuration
│   ├── workflows/          # GitHub Actions workflows
│   └── ISSUE_TEMPLATE/     # Issue and PR templates
├── .husky/                 # Git hooks configuration
│   ├── pre-commit          # Pre-commit hook for linting
│   └── commit-msg          # Commit message validation
├── .vscode/                # VSCode configuration
├── .editorconfig           # Editor configuration
├── .eslintrc.mjs           # Frontend ESLint config (ES Modules)
├── .eslintrc.cjs           # Backend ESLint config (CommonJS)
├── .nvmrc                  # Node.js version specification
├── .prettierrc             # Prettier configuration
├── .tool-versions          # ASDF version manager config
├── commitlint.config.mjs   # Commitlint configuration
├── vite.config.mjs         # Vite build configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies and scripts
```

## Key Files

### Configuration

- `.eslintrc.mjs`: Frontend ESLint configuration using flat config system
- `.eslintrc.cjs`: Backend ESLint configuration using flat config system
- `vite.config.mjs`: Vite 6 build configuration using ES modules
- `tailwind.config.js`: Tailwind CSS configuration
- `tsconfig.json`: TypeScript configuration for frontend
- `package.json`: Project dependencies, scripts, and workspace configuration
- `.prettierrc`: Code formatting rules
- `.editorconfig`: Basic editor settings
- `commitlint.config.mjs`: Conventional commit rules
- `.nvmrc` & `.tool-versions`: Node.js version management

### Git Hooks and CI

- `.husky/`: Git hooks for code quality
  - `pre-commit`: Runs lint-staged for code formatting
  - `commit-msg`: Validates commit messages
- `.github/workflows/`: CI/CD pipelines
  - Lint checks
  - PR title validation
  - Build verification

### Source Code

- `src/`: Frontend React 19 application

  - `main.tsx`: Application entry point
  - `App.tsx`: Main React component
  - `assets/`: Static assets for frontend

- `server/`: Backend Express API
  - `api.js`: Main server implementation
  - `package.json`: Backend-specific configurations

### Documentation

- `docs/`: Project documentation
  - `project-structure.md`: This file
  - `module-systems.md`: Module system configuration details
  - `development-workflow.md`: Development setup and practices
  - `technical-decisions.md`: Architecture and technical decisions
  - `assessment.md`: Original project requirements

## Module System Organization

- Frontend (src/): Uses ES Modules
  - TypeScript/React code
  - Configuration files in .mjs format
- Backend (server/): Uses CommonJS
  - Node.js/Express code
  - Configuration files in .cjs format

## Development Tools

- **Code Quality**:

  - ESLint 9 with flat config
  - Prettier for formatting
  - TypeScript for type safety
  - EditorConfig for basic editor settings

- **Git Workflow**:

  - Husky for Git hooks
  - Lint-staged for pre-commit checks
  - Commitlint for commit message validation
  - GitHub Actions for CI/CD

- **Build Tools**:
  - Vite 6 for frontend
  - TypeScript compiler
  - Tailwind CSS for styling

## Requirements

- Node.js 20+ required for:
  - Vite 6 compatibility
  - ESLint 9 flat config
  - Modern JavaScript features
  - Husky 9 and newer tooling
