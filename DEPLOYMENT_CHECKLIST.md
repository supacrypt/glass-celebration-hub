# Nuptily Wedding App - Deployment Checklist

## 🚀 Easy Production Deployment

This project is configured for seamless deployment to production. Follow this checklist to ensure a smooth deployment process.

### ✅ Pre-Deployment Setup

#### 1. Environment Variables
Set these environment variables in your deployment platform (Vercel, Netlify, etc.):

**Required:**
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `VITE_APP_URL` - Your production domain (e.g., https://nuptul.com)

**Optional:**
- `VITE_CDN_URL` - CDN URL for static assets
- `VITE_GOOGLE_ANALYTICS_ID` - Google Analytics tracking ID
- `VITE_SENTRY_DSN` - Sentry error tracking DSN
- `VITE_CSP_REPORT_URI` - Content Security Policy report URI

#### 2. Feature Flags (Optional)
- `VITE_ENABLE_PERFORMANCE_MONITOR=true`
- `VITE_ENABLE_ADMIN_DASHBOARD=true`
- `VITE_ENABLE_VIDEO_CALLING=true`
- `VITE_ENABLE_REAL_TIME_CHAT=true`
- `VITE_ENABLE_PHOTO_UPLOADS=true`

### 🏗️ Supabase Setup

#### 3. Database Setup
Run the production environment setup:
```bash
npm run setup:production
```

#### 4. Storage Buckets
The following buckets will be created automatically:
- `avatars` (public, 5MB limit)
- `social-media` (public, 25MB limit)
- `user-content` (private, 10MB limit)
- `public-assets` (public, 2MB limit)

#### 5. RLS Policies
Manually create these policies in Supabase Dashboard:

**Avatars Bucket:**
1. Name: `avatar_public_read` | Operation: `SELECT` | Definition: `true`
2. Name: `avatar_user_upload` | Operation: `INSERT` | Definition: `auth.uid()::text = (storage.foldername(name))[1]`
3. Name: `avatar_user_update` | Operation: `UPDATE` | Definition: `auth.uid()::text = (storage.foldername(name))[1]`
4. Name: `avatar_user_delete` | Operation: `DELETE` | Definition: `auth.uid()::text = (storage.foldername(name))[1]`

**Social Media Bucket:**
1. Name: `social_auth_read` | Operation: `SELECT` | Definition: `auth.role() = 'authenticated'`
2. Name: `social_auth_upload` | Operation: `INSERT` | Definition: `auth.role() = 'authenticated'`
3. Name: `social_user_update` | Operation: `UPDATE` | Definition: `auth.uid()::text = (storage.foldername(name))[2]`
4. Name: `social_user_delete` | Operation: `DELETE` | Definition: `auth.uid()::text = (storage.foldername(name))[2]`

### 🚢 Deployment Platforms

#### Option 1: Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

#### Option 2: Netlify
1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Configure build settings: `npm run build` and `dist` folder

#### Option 3: Manual Deployment
1. Build the project: `npm run build`
2. Upload the `dist` folder to your web server
3. Configure your web server to serve the SPA correctly

### 🔄 Automatic Deployment

#### GitHub Actions Setup
The project includes GitHub Actions for automated deployment:

1. **Staging:** PRs automatically deploy to staging
2. **Production:** Pushes to main branch deploy to production

#### Required GitHub Secrets
Add these secrets to your GitHub repository:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_SERVICE_ROLE_KEY`
- `VITE_APP_URL`
- `VITE_CDN_URL`
- `VITE_GOOGLE_ANALYTICS_ID`
- `VITE_SENTRY_DSN`

### 🧪 Testing

#### Pre-Deployment Testing
```bash
# Run all tests
npm run test

# Type checking
npm run type-check

# Linting
npm run lint

# Build verification
npm run build
```

#### Post-Deployment Testing
- [ ] Profile pictures load correctly
- [ ] Social features work (posts, stories, messages)
- [ ] Video calling functions properly
- [ ] Admin dashboard accessible
- [ ] Email confirmations work
- [ ] All pages load without errors

### 📊 Monitoring

#### Performance Monitoring
- Sentry integration for error tracking
- Performance metrics collection
- User activity logging

#### Health Checks
- Database connectivity
- Storage bucket access
- Authentication service
- Real-time features

### 🔐 Security

#### Production Security Measures
- Content Security Policy enabled
- CORS properly configured
- Service role keys never exposed to frontend
- Regular security audits

#### Post-Deployment Security
- Monitor for suspicious activity
- Regularly rotate API keys
- Keep dependencies updated
- Review access logs

### 🚨 Troubleshooting

#### Common Issues

**Profile Pictures Not Loading:**
1. Check storage bucket RLS policies
2. Verify bucket exists and is public
3. Check CORS configuration

**Authentication Issues:**
1. Verify Supabase URL and keys
2. Check email confirmation settings
3. Verify redirect URLs

**Build Failures:**
1. Check all environment variables are set
2. Verify TypeScript types
3. Check for linting errors

#### Support
For deployment issues, check:
- GitHub Actions logs
- Supabase Dashboard logs
- Browser console errors
- Network requests in DevTools

### 🎉 Success!

Once deployed, your wedding app will be live with:
- ✅ Automatic environment switching
- ✅ Production-optimized builds
- ✅ Secure storage and authentication
- ✅ Real-time features
- ✅ Monitoring and error tracking
- ✅ Easy updates via GitHub

The deployment system automatically handles:
- Development vs Production configurations
- Storage bucket optimization
- Performance monitoring
- Security settings
- Feature flags

Just push to main branch and your app deploys automatically! 🚀