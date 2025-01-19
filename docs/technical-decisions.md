# Technical Decisions Log

## Production Deployment Architecture (2025-03-21)

### Context

Need to establish a robust and maintainable production deployment strategy.

### Decisions

1. Process Management:

   - Selected PM2 for process management
   - Ecosystem configuration for environment variables
   - Process monitoring and logs
   - Reason: Reliable Node.js process management and monitoring

2. Database Configuration:

   - Dedicated database directory with proper permissions
   - User-specific ownership for PM2 process
   - Automated backup procedures
   - Reason: Secure and maintainable data storage

3. Multi-Environment Support:

   - Environment-specific configurations
   - Production-specific security measures
   - Separate frontend/backend URLs
   - Reason: Clean separation between environments

4. Storage Provider Strategy:

   - Flexible provider selection per environment
   - CDN integration for production
   - Fallback mechanisms
   - Reason: Optimized for different deployment scenarios

### Consequences

- Reliable production deployment
- Secure database management
- Environment-specific optimization
- Flexible storage configuration

## Multi-Provider Storage System (2025-03-21)

### Context

Need to support multiple storage providers for file storage to give users flexibility in deployment options.

### Decisions

1. Storage Provider Architecture:

   - Implemented abstract StorageProvider interface
   - Factory pattern for provider instantiation
   - Support for AWS S3, Google Cloud Storage, and local storage
   - Reason: Flexible and extensible storage solution

2. Provider-Specific Features:

   - AWS S3: Pre-signed URLs, region configuration
   - Google Cloud Storage: Service account authentication
   - Local Storage: File system management
   - Reason: Leverage provider-specific capabilities

3. Environment Configuration:
   - Provider selection via STORAGE_TYPE
   - Provider-specific credentials management
   - Optional CDN configuration
   - Reason: Simple deployment configuration

### Consequences

- Flexible storage options
- Easy provider switching
- Cloud-agnostic architecture
- Simplified deployment

## File Storage and Email Integration (2025-03-20)

### Context

Need to implement robust file storage for multiple images per memory and email sharing capabilities.

### Decisions

1. File Upload Features:

   - Drag-and-drop support with react-dropzone
   - Upload progress indicators
   - File type validation
   - Reason: Enhanced user experience for file uploads

2. SendGrid Integration:

   - Added SendGrid for email notifications
   - Anonymous sharing capability
   - Email templates for consistency
   - Reason: Reliable email delivery and management

3. Environment Configuration:
   - Secure credential management
   - Storage provider configuration
   - Email sender configuration
   - Reason: Secure and configurable external service integration

### Consequences

- Improved upload experience
- Reliable email delivery
- Better sharing capabilities
- Configurable external services

## Server Architecture Refactoring (2025-03-20)

### Context

Need to improve server code organization and maintainability.

### Decisions

1. Modular Structure:

   - Separated routes, controllers, and utilities
   - Dedicated controller for each feature
   - Centralized database operations
   - Reason: Better code organization and maintainability

2. Enhanced Features:

   - Pagination for memory listing
   - Search and filtering capabilities
   - Random memory selection
   - Reason: Better performance and user experience

3. Error Handling:
   - Centralized error handling
   - Consistent error responses
   - Validation middleware
   - Reason: More reliable error management

### Consequences

- More maintainable codebase
- Better separation of concerns
- Improved error handling
- Enhanced feature set

## Memory Feature Enhancements (2025-03-20)

### Context

Need to enhance memory management with multi-image support and improved sharing.

### Decisions

1. Multi-image Support:

   - Multiple images per memory
   - Image carousel navigation
   - Thumbnail previews
   - Reason: Richer memory content

2. Memory Detail Page:

   - Dedicated view for single memory
   - Enhanced sharing options
   - SEO optimization with meta tags
   - Reason: Better memory viewing and sharing experience

3. Search and Filter:

   - Real-time search capability
   - Sort by date or title
   - Order control (asc/desc)
   - Reason: Better memory organization

4. Infinite Scroll:
   - Lazy loading of memories
   - Performance optimization
   - Loading indicators
   - Reason: Better performance with large datasets

### Consequences

- Enhanced user experience
- Better memory organization
- Improved sharing capabilities
- Better performance with large datasets

## Code Organization and Linting Improvements (2025-01-16)

### Context

Need to improve code organization and fix linting issues across the codebase.

### Decisions

1. Context and Hooks Organization:

   - Separated context definitions into dedicated contexts.ts file
   - Moved hooks into separate hooks/ directory
   - Created index.ts for centralized hook exports
   - Reason: Better separation of concerns and improved maintainability

2. ESLint Configuration Updates:

   - Allowed console usage in server code
   - Added exception for unused catch parameters
   - Configured proper handling of unused variables
   - Reason: Better error handling and logging capabilities while maintaining code quality

3. Import Path Standardization:

   - Updated all context imports to use hooks directory
   - Standardized import paths across components
   - Reason: More consistent and maintainable import structure

### Consequences

- Cleaner code organization
- Better separation of concerns
- More maintainable codebase
- Improved error handling capabilities
- Consistent import patterns

## Authentication and Security Implementation (2025-01-15)

### Context

Need to implement secure authentication and data protection for the application.

### Decisions

1. JWT Authentication:

   - Implemented JWT-based authentication
   - Token stored in localStorage
   - Automatic token validation on API calls
   - Reason: Stateless authentication with good security

2. Security Measures:

   - Password hashing with salt using crypto
   - Rate limiting on auth endpoints
   - CORS configuration with specific origin
   - Input validation with express-validator
   - Reason: Protect against common security threats

3. Database Security:

   - Foreign key constraints
   - User ownership verification
   - Indexed queries for performance
   - Proper error handling
   - Reason: Data integrity and access control

### Consequences

- Secure authentication flow
- Protected API endpoints
- Better data integrity
- Performance optimization

## UI and State Management (2025-01-14)

### Context

Need to implement a responsive UI with proper state management and user preferences.

### Decisions

1. Material-UI Implementation:

   - Used MUI v6 components
   - Custom theme configuration
   - Responsive layout with drawer
   - Reason: Professional UI with good customization

2. State Management:

   - React Context for auth and settings
   - Local storage for persistence
   - Separate contexts for different concerns
   - Reason: Simple but effective state management

3. Settings Management:

   - Theme preferences (light/dark)
   - Display settings (compact view)
   - Layout options (cards per row)
   - Show/hide features (dates, tags)
   - Reason: Customizable user experience

### Consequences

- Consistent UI across app
- Persistent user preferences
- Better user experience
- Maintainable state management

## Memory Management Features (2025-01-13)

### Context

Need to implement comprehensive memory management with good UX.

### Decisions

1. Memory Card Features:

   - Image loading states with skeleton
   - Compact view support
   - Tags system
   - Favorites functionality
   - Reason: Rich feature set with good UX

2. Grid Layout:

   - Responsive grid system
   - Configurable cards per row
   - Proper spacing and alignment
   - Reason: Better presentation of memories

3. Memory Operations:

   - CRUD operations with optimistic updates
   - Confirmation dialogs for destructive actions
   - Error handling and feedback
   - Reason: Reliable data management

### Consequences

- Better user experience
- Reliable data handling
- Flexible layout options
- Rich feature set

## Git Workflow and Code Quality Tools (2025-01-12)

### Context

Need to enforce consistent code quality and commit standards across the team.

### Decisions

1. Git Hooks with Husky:

   - Implemented Husky 9.1.7 for Git hooks
   - Pre-commit hook for code quality
   - Commit-msg hook for message validation
   - Reason: Automated quality checks before commits

2. Commit Standards:

   - Added Commitlint 19.6.1
   - Using conventional commits standard
   - Enforced through Git hooks
   - Reason: Consistent and meaningful commit history

3. Code Formatting:

   - Implemented Prettier 3.4.2
   - Added lint-staged 15.3.0
   - Automated formatting on commit
   - Reason: Consistent code style without manual effort

4. CI Integration:
   - Added GitHub Actions workflows
   - Lint and format checks
   - PR title validation
   - Reason: Ensure quality standards in CI/CD

### Consequences

- Consistent code formatting across team
- Meaningful and standardized commit messages
- Automated quality checks
- Reduced code review friction

## Package and Configuration Updates (2025-01-11)

### Context

Need to update all packages to their latest versions and ensure proper configuration with modern tooling requirements.

### Decisions

1. Node.js Version Requirement:

   - Upgraded to Node.js 20+
   - Required for Vite 6 and ESLint 9
   - Reason: Access to modern features and better tooling compatibility

2. Package Updates:

   - React 19.0.0
   - Vite 6.0.7
   - ESLint 9.18.0
   - TypeScript ESLint 8.19.1
   - Reason: Latest features and security updates

3. ESLint Configuration:
   - Moved to root-level configuration
   - Split into `.eslintrc.mjs` (frontend) and `.eslintrc.cjs` (backend)
   - Using ESLint 9's flat config system
   - Reason: Better organization and modern configuration approach

### Consequences

- Better development experience with latest tools
- Cleaner configuration structure
- Access to modern JavaScript features
- Improved type checking and linting capabilities

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
   - ESLint configs use appropriate extensions (.mjs/.cjs)
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

   - Frontend: TypeScript/React rules with ES Modules
   - Backend: Node.js rules with CommonJS
   - Reason: Different environments need different rules

3. Version Management:
   - Added .nvmrc for Node version
   - Added .tool-versions for ASDF
   - Reason: Consistent development environment

### Consequences

- Simpler development workflow
- Proper linting for each environment
- Better developer experience
- Consistent tooling across team

## Project Structure (2025-01-11)

### Context

Need to organize project files and documentation for clarity and maintainability.

### Decisions

1. Directory Structure:

   - src/ for frontend
   - server/ for backend
   - docs/ for documentation
   - Root-level config files
   - Reason: Clear separation of concerns

2. Documentation Organization:

   - Separate docs for different aspects
   - Main README as index
   - Updated for latest changes
   - Reason: Better maintainability and clarity

3. Editor Configuration:
   - Added .editorconfig
   - VSCode settings and extensions
   - Prettier configuration
   - Reason: Consistent development environment

### Consequences

- Better project organization
- Easier to find and update documentation
- Clear separation of concerns
- Up-to-date documentation for modern tooling
- Consistent editor experience across team
