# 🤝 Contributing to Nuptul

Thank you for your interest in contributing to Nuptul! This guide will help you get started with contributing to our luxury wedding planning platform.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Project Structure](#project-structure)
- [Design System](#design-system)
- [Database Changes](#database-changes)
- [Security Guidelines](#security-guidelines)

## 📜 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

### Our Pledge
- **Respectful**: Treat all contributors with respect and kindness
- **Inclusive**: Welcome contributors from all backgrounds and experience levels
- **Collaborative**: Work together to build amazing features
- **Professional**: Maintain a professional and constructive environment

### Unacceptable Behavior
- Harassment, discrimination, or offensive comments
- Trolling, insulting, or personal attacks
- Public or private harassment
- Sharing private information without consent

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git for version control
- Supabase account (for backend features)
- Basic understanding of React and TypeScript

### Finding Issues to Work On
- Check the [Issues](https://github.com/supacrypt/glass-celebration-hub/issues) tab
- Look for labels like `good first issue`, `help wanted`, or `bug`
- Comment on the issue to let others know you're working on it

### Types of Contributions
- **Bug fixes**: Resolve existing issues
- **New features**: Add new functionality
- **Documentation**: Improve or add documentation
- **Testing**: Add or improve tests
- **Performance**: Optimize existing code
- **Design**: UI/UX improvements

## 🛠️ Development Setup

### 1. Fork and Clone
```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/glass-celebration-hub.git
cd glass-celebration-hub
```

### 2. Set Up Environment
```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Set up development environment
npm run setup:dev
```

### 3. Configure Environment Variables
Edit `.env.local` with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Start Development Server
```bash
npm run dev
```

## 📝 Making Changes

### 1. Create a Branch
```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-description
```

### 2. Branch Naming Convention
- **Features**: `feature/feature-name`
- **Bug fixes**: `fix/issue-description`
- **Documentation**: `docs/what-you-improved`
- **Tests**: `test/what-you-tested`
- **Refactoring**: `refactor/what-you-refactored`

### 3. Make Your Changes
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Test your changes thoroughly

### 4. Commit Your Changes
```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "feat: add user profile avatar upload functionality"
```

### Commit Message Convention
Use conventional commits format:
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `test:` adding or updating tests
- `refactor:` code refactoring
- `style:` formatting changes
- `chore:` maintenance tasks

## 🧪 Testing

### Run All Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

### Writing Tests
- **Unit tests**: Test individual components and functions
- **Integration tests**: Test component interactions
- **E2E tests**: Test complete user workflows

### Test Structure
```javascript
// Example unit test
describe('UserProfile', () => {
  it('should display user name correctly', () => {
    // Test implementation
  });
  
  it('should handle avatar upload', () => {
    // Test implementation
  });
});
```

## 📤 Pull Request Process

### 1. Push Your Changes
```bash
git push origin feature/your-feature-name
```

### 2. Create Pull Request
- Go to the GitHub repository
- Click "New Pull Request"
- Select your branch
- Fill out the PR template

### 3. PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots of UI changes

## Additional Notes
Any additional information
```

### 4. Review Process
- Automated tests must pass
- Code review by maintainers
- Address any feedback
- PR will be merged once approved

## 📏 Coding Standards

### TypeScript
- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type - use proper types
- Use type assertions sparingly

### React Components
```tsx
// Good: Proper TypeScript component
interface UserProfileProps {
  user: User;
  onEdit: (user: User) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onEdit }) => {
  return (
    <div className="profile-container">
      {/* Component implementation */}
    </div>
  );
};
```

### Styling
- Use Tailwind CSS utility classes
- Follow the design system guidelines
- Implement responsive design
- Use CSS custom properties for themes

### Code Organization
- Keep components small and focused
- Use custom hooks for complex logic
- Implement proper error boundaries
- Follow the existing folder structure

## 🏗️ Project Structure

```
src/
├── components/          # Reusable components
│   ├── ui/             # Base UI components
│   ├── navigation/     # Navigation components
│   ├── auth/          # Authentication components
│   ├── social/        # Social features
│   └── admin/         # Admin dashboard
├── pages/             # Page components
├── hooks/             # Custom React hooks
├── contexts/          # React contexts
├── utils/             # Utility functions
├── types/             # TypeScript types
├── config/            # Configuration files
└── assets/            # Static assets
```

### File Naming
- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (`useUserProfile.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Types**: PascalCase (`User.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)

## 🎨 Design System

### Component Architecture
Every component follows the three-layer architecture:

1. **Aurora Background Layer** (z-index: 1)
2. **Glass Middle Layer** (z-index: 20)
3. **Neumorphic Content Layer** (z-index: 30)

### Design Tokens
```typescript
// Use design tokens for consistency
const colors = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  accent: 'hsl(var(--accent))',
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
};
```

### Responsive Design
- Mobile-first approach
- Use Tailwind responsive prefixes
- Test on multiple screen sizes
- Implement touch-friendly interactions

## 🗄️ Database Changes

### Schema Changes
- Create migration files for database changes
- Update TypeScript types
- Add proper RLS policies
- Test with sample data

### Migration Example
```sql
-- Add new column to profiles table
ALTER TABLE profiles ADD COLUMN bio TEXT;

-- Update RLS policy
CREATE POLICY "Users can update their own bio" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

## 🔐 Security Guidelines

### Authentication
- Never expose service role keys in frontend
- Use proper RLS policies
- Validate all user inputs
- Implement rate limiting

### Data Protection
- Sanitize user inputs
- Use parameterized queries
- Implement CSRF protection
- Follow OWASP guidelines

### File Uploads
- Validate file types and sizes
- Scan for malware
- Use secure storage
- Implement access controls

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for complex functions
- Document component props
- Explain complex business logic
- Keep README files up to date

### API Documentation
- Document all API endpoints
- Include request/response examples
- Specify authentication requirements
- Add error handling documentation

## 🐛 Bug Reports

### Before Reporting
- Check existing issues
- Reproduce the bug
- Test in different browsers
- Gather system information

### Bug Report Template
```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser: Chrome 91
- OS: Windows 10
- Device: Desktop
```

## 💡 Feature Requests

### Feature Request Template
```markdown
## Feature Description
Clear description of the feature

## Use Case
Why is this feature needed?

## Proposed Solution
How should this feature work?

## Additional Context
Any other relevant information
```

## 🎯 Performance Guidelines

### Frontend Performance
- Use React.memo for expensive components
- Implement code splitting
- Optimize images and assets
- Minimize bundle size

### Backend Performance
- Optimize database queries
- Use proper indexing
- Implement caching
- Monitor performance metrics

## 📞 Getting Help

### Community Support
- **GitHub Discussions**: Ask questions and share ideas
- **Discord**: Join our development community
- **Email**: Contact maintainers at dev@nuptul.com

### Documentation
- Check the `docs/` folder for detailed guides
- Review existing code for patterns
- Read the architecture documentation

## 🏆 Recognition

Contributors will be recognized in:
- GitHub contributors list
- Project documentation
- Release notes
- Annual contributor awards

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Nuptul! Your efforts help create amazing wedding experiences for couples around the world. 💖