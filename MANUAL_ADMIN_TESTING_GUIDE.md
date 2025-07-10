# Manual Admin Testing Guide
## Testing localhost:8081 Admin Experience with Production Database

**✅ READY TO TEST**: All endpoints accessible, production database connected

---

## 🎯 Testing Protocol

### Step 1: Access Admin Dashboard
1. **Open browser** to: http://localhost:8081/admin/dashboard
2. **Expected**: Should see admin login modal or access denied screen
3. **Document**: What actually appears

### Step 2: Test Admin Authentication
1. **Click** "Admin Login" or similar button
2. **Enter credentials**:
   - Email: `admin@wedding.local`
   - Password: `admin123`
3. **Expected**: Authentication success or specific error message
4. **If login fails**: Try "Create Dev Admin User" button first

### Step 3: Test Admin Dashboard Access
**If authentication succeeds:**
1. **Expected**: Admin dashboard with tabs/sections
2. **Check**: Status indicators show admin role
3. **Document**: Which sections are visible

**If authentication fails:**
1. **Try**: Create Dev Admin User button
2. **Wait**: For admin user creation
3. **Retry**: Login with credentials

---

## 📋 Systematic Section Testing

### Phase 1: Content Management
**Navigate to Content tab:**
- [ ] **App Settings**: Can you edit app name, wedding date, messages?
- [ ] **Events**: Can you create/edit wedding events?
- [ ] **Stats**: Do user counts and metrics load?

**Test Each Form:**
- [ ] Form fields populate with current data
- [ ] Changes can be saved
- [ ] Success/error messages appear
- [ ] Data persists after page refresh

### Phase 2: User & RSVP Management  
**Navigate to Users & RSVPs tab:**
- [ ] **Accounts**: User list loads with data
- [ ] **Guests**: Guest management interface works
- [ ] **RSVPs**: RSVP responses display correctly

**Test Operations:**
- [ ] Can view user details
- [ ] Can edit user information
- [ ] Can manage RSVP responses
- [ ] Pagination works (if applicable)

### Phase 3: Design & Theme Customization
**Navigate to Design tab:**
- [ ] **Themes**: Theme customization options available
- [ ] **Media**: Media manager interface loads
- [ ] **Fonts**: Typography options accessible

**Critical Media Manager Testing:**
- [ ] File upload interface appears
- [ ] Can select files for upload
- [ ] Upload progress shows
- [ ] Files appear in media grid
- [ ] "Set as Hero" button works
- [ ] File deletion works

### Phase 4: Communication Tools
**Navigate to Communication tab:**
- [ ] **Messages**: Messaging interface loads
- [ ] **Notifications**: Notification settings accessible  
- [ ] **Email**: Email system configuration available

### Phase 5: Analytics & System
**Navigate to Analytics tab:**
- [ ] **Analytics**: Data visualization loads
- [ ] **Performance**: Performance metrics display
- [ ] **Insights**: Detailed analytics accessible

**Navigate to System tab:**
- [ ] **Settings**: System configuration options
- [ ] **Security**: Security management tools
- [ ] **Backup**: Backup and recovery options

---

## 🐛 Issue Documentation Template

For each issue found, document:

```markdown
### Issue: [Brief Description]
**Section**: [Which admin section]
**Severity**: High/Medium/Low
**Steps to Reproduce**:
1. Step one
2. Step two
3. Step three

**Expected Behavior**: What should happen
**Actual Behavior**: What actually happens
**Error Messages**: Any console errors or user-facing errors
**Screenshot**: [If applicable]

**Impact**: How this affects admin workflow
**Suggested Fix**: [If you have ideas]
```

---

## ✅ Success Criteria

### Authentication & Access
- [ ] Admin login modal appears
- [ ] Credentials work or dev admin creation succeeds  
- [ ] Dashboard loads with admin interface
- [ ] Role indicators show admin status
- [ ] Navigation between sections works

### Core Functionality
- [ ] App settings can be modified and saved
- [ ] Media manager allows file upload/management
- [ ] User data loads and can be managed
- [ ] RSVP data is accessible and manageable
- [ ] Theme customization tools function

### Data Operations
- [ ] Forms save successfully to database
- [ ] Changes persist after page refresh
- [ ] Error handling works appropriately
- [ ] Loading states appear during operations

### User Experience
- [ ] Interface is intuitive and responsive
- [ ] No JavaScript errors in console
- [ ] Mobile responsiveness (if tested)
- [ ] Performance is acceptable (<3 second loads)

---

## 🚀 Critical Areas to Focus On

### 1. **Authentication Flow** (HIGHEST PRIORITY)
- Does admin login work at all?
- Can dev admin user be created?
- Do admin permissions work with production database?

### 2. **Media Manager** (HIGH PRIORITY)  
- File upload to Supabase storage
- Hero background setting
- File management operations

### 3. **App Settings** (HIGH PRIORITY)
- Wedding details editing
- Text content management  
- Settings persistence

### 4. **User/RSVP Management** (MEDIUM PRIORITY)
- Data loading from production
- CRUD operations
- Role management

### 5. **Theme Customization** (MEDIUM PRIORITY)
- Color/font changes
- Live preview functionality
- Settings application

---

## 📝 Testing Results Summary

**Date**: [Fill in]  
**Tester**: [Fill in]  
**Duration**: [Fill in]

### Quick Status Check:
- **Admin Login**: ✅ / ❌
- **Content Management**: ✅ / ❌  
- **Media Manager**: ✅ / ❌
- **User Management**: ✅ / ❌
- **Design Tools**: ✅ / ❌

### Major Issues Found:
1. [Issue 1]
2. [Issue 2]  
3. [Issue 3]

### Recommendations:
1. [Recommendation 1]
2. [Recommendation 2]
3. [Recommendation 3]

---

## 🔧 Developer Notes

**Database Connection**: ✅ Production Supabase  
**Admin System**: ✅ ImprovedAdminDashboard implemented  
**Authentication**: ✅ useAdminAuth hook with dev admin creation  
**RLS Policies**: ✅ Optimized for admin access  

**Next Steps After Testing**:
1. Fix critical issues identified
2. Optimize user experience problems
3. Test as regular user (non-admin)
4. Performance optimization
5. Production deployment preparation