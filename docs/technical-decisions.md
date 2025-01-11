# Technical Decisions Log

## Module System Organization (2025-01-11)

### Context
The project needed clear separation between frontend and backend module systems while maintaining proper tooling configuration.

### Decisions
1. Frontend (ES Modules):
   - Kept frontend code in src/ using ES Modules
   - Vite and related tools configured for ES Modules
   - Reason: Modern frontend ecosystem primarily uses ES Modules

2. Backend (CommonJS):
   - Moved backend code to server/ directory
   - Added explicit CommonJS configuration
   - Reason: Better compatibility with Node.js ecosystem

3. Configuration Files:
   - ESLint configs use .cjs extension
   - Build tools (Vite, Tailwind) use ES Modules
   - Reason: Follow tool-specific requirements while being explicit

### Consequences
- Clearer separation between frontend and backend code
- More explicit module system configuration
- Better alignment with ecosystem standards
- Easier onboarding for new developers

## Development Workflow Enhancement (2025-01-11)

### Context
Need to run both frontend and backend servers during development.

### Decisions
1. Combined Dev Command:
   - Added single `npm run dev` command
   - Uses shell parallel execution
   - Reason: Simplify development workflow

2. Separate Lint Configurations:
   - Frontend: TypeScript/React rules
   - Backend: Node.js rules
   - Reason: Different environments need different rules

### Consequences
- Simpler development workflow
- Proper linting for each environment
- Better developer experience

## Project Structure (2025-01-11)

### Context
Need to organize project files and documentation for clarity and maintainability.

### Decisions
1. Directory Structure:
   - src/ for frontend
   - server/ for backend
   - docs/ for documentation
   - Reason: Clear separation of concerns

2. Documentation Organization:
   - Separate docs for different aspects
   - Main README as index
   - Reason: Better maintainability and clarity

### Consequences
- Better project organization
- Easier to find and update documentation
- Clear separation of concerns
