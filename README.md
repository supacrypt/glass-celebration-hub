# 💍 Nuptul - Luxury Wedding Planning Platform

<div align="center">
  <img src="https://github.com/supacrypt/glass-celebration-hub/assets/logo/nuptul-logo.svg" alt="Nuptul Logo" width="200" height="200" />
  
  **A sophisticated wedding planning platform that combines elegance with cutting-edge technology**
  
  [![Deploy Status](https://github.com/supacrypt/glass-celebration-hub/actions/workflows/deploy.yml/badge.svg)](https://github.com/supacrypt/glass-celebration-hub/actions/workflows/deploy.yml)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)
</div>

## ✨ Features

### 🎨 **Modern Design System**
- **Aurora UI**: Organic, living backgrounds with gradient animations
- **Glassmorphism**: Transparent elegance with depth and blur effects
- **Neumorphism**: Soft, tactile interfaces with realistic shadows
- **Responsive Design**: Seamless experience across all devices

### 👥 **Social Features**
- **Real-time Messaging**: Instant communication with WebRTC video/audio calls
- **Social Feed**: Share memories, photos, and moments with guests
- **Stories**: Ephemeral content sharing with 24-hour expiration
- **Presence System**: See who's online and available to chat

### 🔐 **Secure Authentication**
- **Email Verification**: Secure signup with email confirmation
- **Role-based Access**: Guest, Admin, and Couple permission levels
- **Profile Management**: Complete user profiles with avatar uploads
- **Magic Link Login**: Passwordless authentication option

### 📱 **Guest Management**
- **RSVP System**: Streamlined response collection
- **Plus-one Handling**: Automatic relationship linking
- **Dietary Requirements**: Comprehensive meal preference tracking
- **Transportation**: Bus booking and carpool coordination

### 🎯 **Admin Dashboard**
- **User Management**: Role assignments and profile oversight
- **Analytics**: Guest statistics and engagement metrics
- **Content Management**: Dynamic content and FAQ administration
- **Communication Center**: Broadcast messages and notifications

### 🚀 **Technical Excellence**
- **TypeScript**: Full type safety and developer experience
- **Real-time Updates**: Live data synchronization with Supabase
- **Performance Optimized**: Lazy loading and code splitting
- **PWA Ready**: Offline support and mobile app experience

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality component library
- **Framer Motion** - Smooth animations and transitions

### Backend
- **Supabase** - PostgreSQL database with real-time subscriptions
- **Row Level Security** - Database-level access control
- **Storage** - File uploads and CDN integration
- **Edge Functions** - Serverless compute for backend logic

### Development Tools
- **ESLint & Prettier** - Code quality and formatting
- **Husky** - Git hooks for pre-commit validation
- **Jest** - Unit testing framework
- **Playwright** - End-to-end testing
- **GitHub Actions** - CI/CD pipeline

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/supacrypt/glass-celebration-hub.git
   cd glass-celebration-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Setup development environment**
   ```bash
   npm run setup:dev
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:8090
   ```

## 📦 Deployment

### Automatic Deployment
Push to the `main` branch for automatic production deployment via GitHub Actions.

### Manual Deployment
1. **Build for production**
   ```bash
   npm run build
   ```

2. **Setup production environment**
   ```bash
   npm run setup:production
   ```

3. **Deploy to your hosting platform**
   - Upload the `dist` folder to your web server
   - Configure environment variables
   - Setup Supabase RLS policies

### Environment Variables

#### Required
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_URL=your_production_domain
```

#### Optional
```env
VITE_CDN_URL=your_cdn_url
VITE_GOOGLE_ANALYTICS_ID=your_ga_id
VITE_SENTRY_DSN=your_sentry_dsn
VITE_ENABLE_PERFORMANCE_MONITOR=true
VITE_ENABLE_VIDEO_CALLING=true
```

## 🧪 Testing

### Unit Tests
```bash
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Generate coverage report
```

### End-to-End Tests
```bash
npm run test:e2e          # Run E2E tests
npm run test:e2e:headed   # Run with browser UI
npm run test:e2e:debug    # Debug mode
```

### Type Checking
```bash
npm run type-check        # Validate TypeScript types
```

### Linting
```bash
npm run lint              # Check code quality
```

## 📚 Documentation

### Core Documentation
- [Deployment Guide](./DEPLOYMENT_CHECKLIST.md) - Complete deployment instructions
- [Architecture Overview](./docs/ARCHITECTURE.md) - System design and structure
- [API Reference](./docs/API.md) - Backend API documentation
- [Component Library](./docs/COMPONENTS.md) - UI component documentation

### Development Guides
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute to the project
- [Development Setup](./docs/DEVELOPMENT.md) - Local development environment
- [Testing Guide](./docs/TESTING.md) - Testing strategies and best practices
- [Performance Guide](./docs/PERFORMANCE.md) - Optimization techniques

### User Documentation
- [User Guide](./docs/USER_GUIDE.md) - End-user documentation
- [Admin Guide](./docs/ADMIN_GUIDE.md) - Administrative features
- [FAQ](./docs/FAQ.md) - Frequently asked questions

## 🔧 Development

### Project Structure
```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── contexts/           # React context providers
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── config/             # Configuration files
└── assets/             # Static assets
```

### Key Features Implementation
- **Real-time Communication**: WebRTC for video/audio calls
- **File Storage**: Supabase storage with CDN integration
- **Authentication**: Row-level security with Supabase Auth
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **State Management**: React Context with optimized performance

### Performance Optimizations
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: WebP format with fallbacks
- **Caching**: Strategic caching for static assets
- **Bundle Size**: Tree shaking and unused code elimination

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on:
- Code of conduct
- Development workflow
- Pull request process
- Coding standards

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design System**: Inspired by modern luxury wedding aesthetics
- **Open Source**: Built with amazing open-source technologies
- **Community**: Thanks to all contributors and users
- **Supabase**: For providing an excellent backend platform

## 📞 Support

### Getting Help
- **Documentation**: Check the docs folder for detailed guides
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join GitHub Discussions for questions
- **Email**: Contact us at support@nuptul.com

### Community
- **Discord**: Join our development community
- **Twitter**: Follow [@NuptulApp](https://twitter.com/NuptulApp) for updates
- **Blog**: Read our development blog at blog.nuptul.com

---

<div align="center">
  <p>Made with 💖 for couples planning their perfect day</p>
  <p>© 2024 Nuptul. All rights reserved.</p>
</div>