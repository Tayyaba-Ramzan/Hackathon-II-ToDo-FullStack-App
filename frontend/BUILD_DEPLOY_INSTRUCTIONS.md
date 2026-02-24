# Build & Deploy Instructions

## SECTION 3: BUILD & DEPLOY INSTRUCTIONS

Complete step-by-step guide to rebuild and deploy your Next.js application to Vercel after fixing the folder structure.

---

## PHASE 1: LOCAL VERIFICATION

### Step 1: Stop All Running Processes
```bash
# Stop frontend dev server (Ctrl+C in terminal)
# Stop backend server if running
```

### Step 2: Apply Folder Structure Fix

**Option A: Manual (Recommended for Windows)**
1. Open File Explorer → Navigate to `frontend/app/`
2. Create new folder: `(dashboard)` (include parentheses)
3. Open `app/app/` folder
4. Select all folders: `dashboard`, `tasks`, `completed`, `analytics`, `settings`
5. Cut (Ctrl+X) and paste into `(dashboard)/`
6. Move `app/app/layout.tsx` to `(dashboard)/layout.tsx`
7. Delete empty `app/app/` folder

**Option B: Command Line (Linux/Mac)**
```bash
cd frontend/app
mkdir "(dashboard)"
mv app/dashboard "(dashboard)/"
mv app/tasks "(dashboard)/"
mv app/completed "(dashboard)/"
mv app/analytics "(dashboard)/"
mv app/settings "(dashboard)/"
mv app/layout.tsx "(dashboard)/"
rmdir app
```

### Step 3: Update Import Paths

**Quick Search & Replace (PowerShell - Windows):**
```powershell
cd frontend

# Update all /app/* paths to /*
Get-ChildItem -Recurse -Include *.tsx,*.ts | ForEach-Object {
  $content = Get-Content $_.FullName -Raw
  $content = $content -replace "'/app/dashboard'", "'/dashboard'"
  $content = $content -replace '"/app/dashboard"', '"/dashboard"'
  $content = $content -replace "'/app/tasks'", "'/tasks'"
  $content = $content -replace '"/app/tasks"', '"/tasks"'
  $content = $content -replace "'/app/completed'", "'/completed'"
  $content = $content -replace '"/app/completed"', '"/completed"'
  $content = $content -replace "'/app/analytics'", "'/analytics'"
  $content = $content -replace '"/app/analytics"', '"/analytics"'
  $content = $content -replace "'/app/settings'", "'/settings'"
  $content = $content -replace '"/app/settings"', '"/settings"'
  Set-Content $_.FullName -Value $content -NoNewline
}
```

**Manual Update (Recommended):**
Update these files manually (see IMPORT_PATH_UPDATES.md for details):
- `components/layout/Sidebar.tsx`
- `components/layout/TopNavbar.tsx`
- `app/page.tsx`
- `app/(auth)/signin/page.tsx`
- `app/(auth)/signup/page.tsx`
- `lib/auth-context.tsx` (if applicable)

### Step 4: Verify Changes
```bash
cd frontend

# Search for any remaining /app/* references
grep -r "'/app/dashboard'" . --include="*.tsx" --include="*.ts"
grep -r '"/app/dashboard"' . --include="*.tsx" --include="*.ts"
grep -r "'/app/tasks'" . --include="*.tsx" --include="*.ts"
grep -r "'/app/completed'" . --include="*.tsx" --include="*.ts"
grep -r "'/app/analytics'" . --include="*.tsx" --include="*.ts"
grep -r "'/app/settings'" . --include="*.tsx" --include="*.ts"

# Should return no results
```

**Windows PowerShell:**
```powershell
Select-String -Path "*.tsx","*.ts" -Pattern "/app/dashboard" -Recurse
Select-String -Path "*.tsx","*.ts" -Pattern "/app/tasks" -Recurse
Select-String -Path "*.tsx","*.ts" -Pattern "/app/completed" -Recurse
Select-String -Path "*.tsx","*.ts" -Pattern "/app/analytics" -Recurse
Select-String -Path "*.tsx","*.ts" -Pattern "/app/settings" -Recurse
```

### Step 5: Clean Build Artifacts
```bash
cd frontend

# Remove build cache
rm -rf .next
rm -rf node_modules/.cache

# Optional: Reinstall dependencies
rm -rf node_modules
npm install
```

### Step 6: Test Local Build
```bash
cd frontend

# Build for production
npm run build

# Expected output:
# ✓ Compiled successfully
# Route (app)
# ├ ○ /
# ├ ○ /analytics
# ├ ○ /completed
# ├ ○ /dashboard
# ├ ○ /settings
# ├ ○ /signin
# ├ ○ /signup
# └ ○ /tasks
```

**✅ Success Criteria:**
- Build completes without errors
- No `/app/dashboard` routes in output
- Routes show `/dashboard`, `/tasks`, etc. (without `/app` prefix)

### Step 7: Test Local Development Server
```bash
npm run dev

# Open browser: http://localhost:3000
```

**Test Checklist:**
- [ ] Landing page loads
- [ ] Sign-in page accessible at `/signin`
- [ ] Sign-up page accessible at `/signup`
- [ ] After login, redirects to `/dashboard` (not `/app/dashboard`)
- [ ] Sidebar navigation works
- [ ] All pages accessible: `/dashboard`, `/tasks`, `/completed`, `/analytics`, `/settings`
- [ ] No 404 errors in browser console

---

## PHASE 2: VERCEL DEPLOYMENT

### Step 1: Commit Changes to Git
```bash
cd frontend

# Check status
git status

# Stage all changes
git add .

# Commit with descriptive message
git commit -m "fix: correct Next.js App Router folder structure

- Move app/app/* to app/(dashboard)/*
- Update all navigation paths from /app/* to /*
- Fix route group structure for proper URL routing
- Remove /app prefix from all routes"

# Push to repository
git push origin main
```

### Step 2: Configure Vercel Project

**If deploying for the first time:**

1. Go to https://vercel.com/
2. Click "Add New" → "Project"
3. Import your Git repository
4. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

**Environment Variables:**
Add these in Vercel Dashboard → Settings → Environment Variables:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### Step 3: Deploy to Vercel

**Option A: Automatic Deployment (Recommended)**
```bash
# Push to main branch triggers automatic deployment
git push origin main

# Vercel will automatically:
# 1. Detect changes
# 2. Build the project
# 3. Deploy to production
```

**Option B: Manual Deployment via Vercel CLI**
```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
cd frontend
vercel --prod

# Follow prompts:
# - Link to existing project or create new
# - Confirm settings
# - Wait for deployment
```

### Step 4: Monitor Deployment

1. Go to Vercel Dashboard
2. Select your project
3. Click on latest deployment
4. Monitor build logs

**Expected Build Output:**
```
Running "npm run build"
▲ Next.js 16.1.6
✓ Compiled successfully
Route (app)
├ ○ /
├ ○ /analytics
├ ○ /completed
├ ○ /dashboard
├ ○ /settings
├ ○ /signin
├ ○ /signup
└ ○ /tasks

Build completed successfully
```

### Step 5: Verify Deployment

**Test Production URLs:**
```bash
# Replace YOUR_PROJECT with your Vercel project name
https://YOUR_PROJECT.vercel.app/
https://YOUR_PROJECT.vercel.app/signin
https://YOUR_PROJECT.vercel.app/signup
https://YOUR_PROJECT.vercel.app/dashboard
https://YOUR_PROJECT.vercel.app/tasks
https://YOUR_PROJECT.vercel.app/completed
https://YOUR_PROJECT.vercel.app/analytics
https://YOUR_PROJECT.vercel.app/settings
```

**Deployment Checklist:**
- [ ] Landing page loads correctly
- [ ] Sign-in/Sign-up pages accessible
- [ ] Dashboard accessible at `/dashboard` (not `/app/dashboard`)
- [ ] All navigation links work
- [ ] No 404 errors
- [ ] API calls work (if backend is deployed)
- [ ] Authentication flow works
- [ ] All pages render correctly

---

## PHASE 3: TROUBLESHOOTING

### Issue 1: Build Fails with "Module not found"

**Cause:** Import paths still reference old structure

**Solution:**
```bash
# Search for remaining /app/* references
grep -r "/app/dashboard" frontend/
grep -r "/app/tasks" frontend/

# Update any found references
# Rebuild
npm run build
```

### Issue 2: 404 Errors on Deployed Site

**Cause:** Vercel cached old routes

**Solution:**
1. Go to Vercel Dashboard
2. Select project → Settings → General
3. Scroll to "Deployment Protection"
4. Click "Redeploy" on latest deployment
5. Check "Use existing Build Cache" is UNCHECKED
6. Click "Redeploy"

### Issue 3: Routes Still Show /app/* Prefix

**Cause:** Folder structure not properly updated

**Solution:**
```bash
# Verify folder structure
ls -la frontend/app/

# Should see:
# (auth)/
# (dashboard)/
# layout.tsx
# page.tsx
# globals.css

# Should NOT see:
# app/ (nested directory)
```

### Issue 4: Sidebar Navigation Broken

**Cause:** Navigation links not updated

**Solution:**
Check `components/layout/Sidebar.tsx`:
```typescript
// All hrefs should be:
href: '/dashboard'  // ✅ Correct
href: '/tasks'      // ✅ Correct

// NOT:
href: '/app/dashboard'  // ❌ Wrong
```

### Issue 5: Redirect After Login Goes to Wrong Page

**Cause:** Auth redirect paths not updated

**Solution:**
Check these files:
- `app/(auth)/signin/page.tsx`
- `app/(auth)/signup/page.tsx`
- `lib/auth-context.tsx`

Update all `router.push('/app/dashboard')` to `router.push('/dashboard')`

---

## PHASE 4: POST-DEPLOYMENT VERIFICATION

### Automated Testing Script

Create `frontend/test-routes.sh`:
```bash
#!/bin/bash

BASE_URL="https://YOUR_PROJECT.vercel.app"

echo "Testing routes..."

routes=(
  "/"
  "/signin"
  "/signup"
  "/dashboard"
  "/tasks"
  "/completed"
  "/analytics"
  "/settings"
)

for route in "${routes[@]}"; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$route")
  if [ $status -eq 200 ]; then
    echo "✅ $route - OK ($status)"
  else
    echo "❌ $route - FAILED ($status)"
  fi
done
```

Run:
```bash
chmod +x test-routes.sh
./test-routes.sh
```

### Manual Testing Checklist

- [ ] **Landing Page:** Loads and shows hero section
- [ ] **Sign Up:** Can create new account
- [ ] **Sign In:** Can login with credentials
- [ ] **Dashboard:** Shows after login at `/dashboard`
- [ ] **Navigation:** All sidebar links work
- [ ] **Tasks Page:** Can create/edit/delete tasks
- [ ] **Completed Page:** Shows completed tasks
- [ ] **Analytics Page:** Shows "Coming Soon" message
- [ ] **Settings Page:** Can update profile
- [ ] **Logout:** Returns to landing page
- [ ] **Protected Routes:** Redirect to `/signin` when not authenticated
- [ ] **Mobile View:** Responsive design works
- [ ] **Browser Console:** No errors

---

## PHASE 5: ROLLBACK PLAN (If Needed)

If deployment fails and you need to rollback:

### Option 1: Revert Git Commit
```bash
# Find commit hash before changes
git log --oneline

# Revert to previous commit
git revert HEAD

# Push revert
git push origin main
```

### Option 2: Vercel Instant Rollback
1. Go to Vercel Dashboard
2. Select project → Deployments
3. Find previous working deployment
4. Click "..." → "Promote to Production"

---

## SUCCESS CRITERIA

Your deployment is successful when:

✅ **Build:**
- `npm run build` completes without errors
- Routes show correct paths (no `/app` prefix)

✅ **Local Testing:**
- All pages accessible
- Navigation works
- No console errors

✅ **Vercel Deployment:**
- Build succeeds on Vercel
- All routes return 200 status
- Production site fully functional

✅ **User Experience:**
- Clean URLs (e.g., `/dashboard` not `/app/dashboard`)
- Fast page loads
- No broken links
- Authentication flow works

---

## ADDITIONAL RESOURCES

- **Next.js App Router Docs:** https://nextjs.org/docs/app
- **Route Groups:** https://nextjs.org/docs/app/building-your-application/routing/route-groups
- **Vercel Deployment:** https://vercel.com/docs/deployments/overview
- **Troubleshooting:** https://nextjs.org/docs/messages

---

## SUPPORT

If you encounter issues not covered here:

1. Check build logs in Vercel Dashboard
2. Verify folder structure matches corrected diagram
3. Search for remaining `/app/*` references
4. Test locally before deploying
5. Use Vercel's deployment preview for testing

**Need help?** Check the generated documentation:
- `FOLDER_STRUCTURE_FIX.md`
- `IMPORT_PATH_UPDATES.md`
- This file: `BUILD_DEPLOY_INSTRUCTIONS.md`
