# Project Structure

## Overview
The project is organized into two main parts:
- Frontend (src/): React/TypeScript application using Vite
- Backend (server/): Express/Node.js API with SQLite database

## Directory Structure
```
memory-lane/
├── src/                  # Frontend source code (ES Modules)
│   ├── .eslintrc.cjs    # Frontend ESLint config
│   ├── assets/          # Static assets
│   ├── App.tsx          # Main React component
│   └── main.tsx         # Application entry point
├── server/              # Backend source code (CommonJS)
│   ├── .eslintrc.cjs    # Backend ESLint config
│   ├── api.js           # Express API implementation
│   └── package.json     # Backend-specific dependencies
├── public/              # Public static files
├── docs/               # Project documentation
└── package.json        # Project dependencies and scripts
```

## Key Files
- `package.json`: Main project configuration and scripts
- `vite.config.ts`: Vite build configuration
- `tailwind.config.js`: Tailwind CSS configuration
- `tsconfig.json`: TypeScript configuration for frontend
