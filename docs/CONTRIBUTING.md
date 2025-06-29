
# Contributing to Healthcare Billing Management System

Thank you for your interest in contributing to our project! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

We are committed to fostering a welcoming and inclusive environment. Please read and follow our Code of Conduct (link to be added).

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- Git
- A code editor (VS Code recommended)

### Development Setup

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/your-username/healthcare-billing-management.git
   cd healthcare-billing-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## How to Contribute

### Reporting Bugs

1. Check existing issues to avoid duplicates
2. Use the bug report template
3. Provide detailed steps to reproduce
4. Include screenshots if helpful
5. Specify your environment details

### Suggesting Features

1. Check existing feature requests
2. Use the feature request template
3. Explain the use case and benefits
4. Consider implementation complexity

### Code Contributions

1. **Pick an issue**
   - Look for issues labeled `good first issue` for beginners
   - Comment on the issue to let others know you're working on it

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

3. **Make your changes**
   - Follow coding standards
   - Write tests for new functionality
   - Update documentation as needed

4. **Test your changes**
   ```bash
   npm run test
   npm run build
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

6. **Push and create PR**
   ```bash
   git push origin your-branch-name
   # Then create a Pull Request on GitHub
   ```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type when possible
- Use strict TypeScript configuration

### React

- Use functional components with hooks
- Follow React best practices
- Use proper prop types
- Implement proper error boundaries

### Styling

- Use Tailwind CSS for styling
- Follow existing design patterns
- Ensure responsive design
- Use Shadcn/UI components when available

### File Organization

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── services/           # API services
└── lib/                # Third-party library configurations
```

### Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Files**: camelCase for utilities, PascalCase for components
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Functions**: camelCase, descriptive names

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(dashboard): add revenue chart component
fix(reports): resolve PDF generation error
docs(readme): update installation instructions
refactor(utils): simplify date formatting functions
```

## Pull Request Process

1. **Before submitting**
   - Ensure your code follows the coding standards
   - Run tests and ensure they pass
   - Update documentation if needed
   - Rebase your branch on the latest main branch

2. **PR Requirements**
   - Use the provided PR template
   - Provide clear description of changes
   - Link related issues
   - Include screenshots for UI changes
   - Ensure CI checks pass

3. **Review Process**
   - Maintainers will review your PR
   - Address feedback promptly
   - Be open to suggestions and changes
   - Once approved, your PR will be merged

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Write unit tests for utilities and hooks
- Write integration tests for complex features
- Use React Testing Library for component tests
- Aim for good test coverage on new code

### Test Structure

```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test implementation
  });

  it('should handle user interactions', () => {
    // Test implementation
  });
});
```

## Documentation

### Code Documentation

- Add JSDoc comments for complex functions
- Document component props with TypeScript
- Include inline comments for complex logic

### README Updates

- Update README for new features
- Include setup instructions
- Add usage examples

### API Documentation

- Document new API endpoints
- Include request/response examples
- Update OpenAPI specs if applicable

## Questions and Support

- **Documentation**: Check existing docs first
- **Issues**: Search existing issues before creating new ones
- **Discussions**: Use GitHub Discussions for questions
- **Contact**: Reach out to maintainers for complex questions

## Recognition

Contributors will be recognized in our README and release notes. Thank you for making this project better!

---

By contributing to this project, you agree that your contributions will be licensed under the same license as the project.
