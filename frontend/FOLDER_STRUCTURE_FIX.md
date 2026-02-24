# Next.js Folder Structure Fix Guide

## STEP 1: Stop Development Server
```bash
# Stop the running dev server (Ctrl+C)
# This releases file locks
```

## STEP 2: Create New Route Group Directory
```bash
cd frontend/app
mkdir "(dashboard)"
```

## STEP 3: Move All Pages
```bash
# Move each directory from app/app/ to app/(dashboard)/
mv app/dashboard "(dashboard)/"
mv app/tasks "(dashboard)/"
mv app/completed "(dashboard)/"
mv app/analytics "(dashboard)/"
mv app/settings "(dashboard)/"

# Move the layout file
mv app/layout.tsx "(dashboard)/"
```

## STEP 4: Remove Old Directory
```bash
# After moving all contents
rmdir app
```

## STEP 5: Verify New Structure
```bash
ls -la
# Should see:
# (auth)/
# (dashboard)/
# layout.tsx
# page.tsx
# globals.css
```

---

## ALTERNATIVE: Manual File Explorer Method

1. Open `frontend/app/` in File Explorer
2. Create new folder named `(dashboard)` (include parentheses)
3. Open `app/app/` folder
4. Select all folders: dashboard, tasks, completed, analytics, settings
5. Cut (Ctrl+X) and paste into `(dashboard)/`
6. Move `app/app/layout.tsx` to `(dashboard)/layout.tsx`
7. Delete empty `app/app/` folder

---

## FINAL STRUCTURE

```
frontend/app/
├── (auth)/
│   ├── signin/
│   │   └── page.tsx
│   └── signup/
│       └── page.tsx
├── (dashboard)/
│   ├── analytics/
│   │   └── page.tsx
│   ├── completed/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── settings/
│   │   └── page.tsx
│   ├── tasks/
│   │   └── page.tsx
│   └── layout.tsx
├── favicon.ico
├── globals.css
├── layout.tsx
└── page.tsx
```

---

## URL MAPPING AFTER FIX

| Old URL | New URL |
|---------|---------|
| /app/dashboard | /dashboard |
| /app/tasks | /tasks |
| /app/completed | /completed |
| /app/analytics | /analytics |
| /app/settings | /settings |
| /signin | /signin (unchanged) |
| /signup | /signup (unchanged) |
