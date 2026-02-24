# Import Path Updates Guide

## SECTION 2: UPDATED IMPORTS

After moving from `app/app/` to `app/(dashboard)/`, you need to update all navigation paths.

---

## FILES REQUIRING UPDATES

### 1. components/layout/Sidebar.tsx

**Location:** `frontend/components/layout/Sidebar.tsx`

**Changes Required:**

```typescript
// BEFORE (Lines 18, 27, 36, 45, 54)
const navItems = [
  {
    name: 'Dashboard',
    href: '/app/dashboard',  // ❌ OLD
  },
  {
    name: 'My Tasks',
    href: '/app/tasks',      // ❌ OLD
  },
  {
    name: 'Completed',
    href: '/app/completed',  // ❌ OLD
  },
  {
    name: 'Analytics',
    href: '/app/analytics',  // ❌ OLD
  },
  {
    name: 'Settings',
    href: '/app/settings',   // ❌ OLD
  },
];

// AFTER
const navItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',      // ✅ NEW
  },
  {
    name: 'My Tasks',
    href: '/tasks',          // ✅ NEW
  },
  {
    name: 'Completed',
    href: '/completed',      // ✅ NEW
  },
  {
    name: 'Analytics',
    href: '/analytics',      // ✅ NEW
  },
  {
    name: 'Settings',
    href: '/settings',       // ✅ NEW
  },
];
```

---

### 2. components/layout/TopNavbar.tsx

**Location:** `frontend/components/layout/TopNavbar.tsx`

**Search for any router.push() or Link href with `/app/` prefix and update:**

```typescript
// BEFORE
router.push('/app/dashboard');

// AFTER
router.push('/dashboard');
```

---

### 3. app/page.tsx (Landing Page)

**Location:** `frontend/app/page.tsx`

**Changes Required:**

```typescript
// BEFORE (Line 17)
useEffect(() => {
  if (!loading && user) {
    router.push('/app/dashboard');  // ❌ OLD
  }
}, [user, loading, router]);

// AFTER
useEffect(() => {
  if (!loading && user) {
    router.push('/dashboard');      // ✅ NEW
  }
}, [user, loading, router]);
```

---

### 4. app/(auth)/signin/page.tsx

**Location:** `frontend/app/(auth)/signin/page.tsx`

**Changes Required:**

```typescript
// BEFORE (Line 24)
useEffect(() => {
  if (!authLoading && user) {
    router.push('/app/dashboard');  // ❌ OLD
  }
}, [user, authLoading, router]);

// AFTER
useEffect(() => {
  if (!authLoading && user) {
    router.push('/dashboard');      // ✅ NEW
  }
}, [user, authLoading, router]);

// Also check the login success handler
// BEFORE
const handleSubmit = async (e: React.FormEvent) => {
  // ... login logic
  router.push('/app/dashboard');    // ❌ OLD
};

// AFTER
const handleSubmit = async (e: React.FormEvent) => {
  // ... login logic
  router.push('/dashboard');        // ✅ NEW
};
```

---

### 5. app/(auth)/signup/page.tsx

**Location:** `frontend/app/(auth)/signup/page.tsx`

**Changes Required:**

```typescript
// BEFORE (Line 24)
useEffect(() => {
  if (!authLoading && user) {
    router.push('/app/dashboard');  // ❌ OLD
  }
}, [user, authLoading, router]);

// AFTER
useEffect(() => {
  if (!authLoading && user) {
    router.push('/dashboard');      // ✅ NEW
  }
}, [user, authLoading, router]);

// Also check the signup success handler
// BEFORE
const handleSubmit = async (e: React.FormEvent) => {
  // ... signup logic
  router.push('/app/dashboard');    // ❌ OLD
};

// AFTER
const handleSubmit = async (e: React.FormEvent) => {
  // ... signup logic
  router.push('/dashboard');        // ✅ NEW
};
```

---

### 6. app/(dashboard)/layout.tsx

**Location:** `frontend/app/(dashboard)/layout.tsx`

**Changes Required:**

```typescript
// BEFORE (Line 21)
useEffect(() => {
  if (!loading && !user) {
    router.push('/signin');  // ✅ This is correct (no change needed)
  }
}, [user, loading, router]);
```

**Note:** This file doesn't need changes as it redirects to `/signin` which is correct.

---

### 7. lib/auth-context.tsx (if exists)

**Location:** `frontend/lib/auth-context.tsx`

**Search for any `/app/` references in:**
- Login success handlers
- Logout handlers
- Token refresh logic

```typescript
// BEFORE
router.push('/app/dashboard');

// AFTER
router.push('/dashboard');
```

---

## SEARCH & REPLACE COMMAND

**Quick Fix (Use with caution):**

```bash
# In frontend directory
find . -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i 's|/app/dashboard|/dashboard|g' {} +
find . -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i 's|/app/tasks|/tasks|g' {} +
find . -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i 's|/app/completed|/completed|g' {} +
find . -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i 's|/app/analytics|/analytics|g' {} +
find . -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i 's|/app/settings|/settings|g' {} +
```

**Windows PowerShell:**

```powershell
# In frontend directory
Get-ChildItem -Recurse -Include *.tsx,*.ts | ForEach-Object {
  (Get-Content $_.FullName) -replace '/app/dashboard', '/dashboard' |
  Set-Content $_.FullName
}
Get-ChildItem -Recurse -Include *.tsx,*.ts | ForEach-Object {
  (Get-Content $_.FullName) -replace '/app/tasks', '/tasks' |
  Set-Content $_.FullName
}
Get-ChildItem -Recurse -Include *.tsx,*.ts | ForEach-Object {
  (Get-Content $_.FullName) -replace '/app/completed', '/completed' |
  Set-Content $_.FullName
}
Get-ChildItem -Recurse -Include *.tsx,*.ts | ForEach-Object {
  (Get-Content $_.FullName) -replace '/app/analytics', '/analytics' |
  Set-Content $_.FullName
}
Get-ChildItem -Recurse -Include *.tsx,*.ts | ForEach-Object {
  (Get-Content $_.FullName) -replace '/app/settings', '/settings' |
  Set-Content $_.FullName
}
```

---

## VERIFICATION CHECKLIST

After making changes, verify:

- [ ] All Sidebar navigation links updated
- [ ] All TopNavbar links updated
- [ ] Landing page redirect updated
- [ ] Sign-in page redirect updated
- [ ] Sign-up page redirect updated
- [ ] Auth context redirects updated
- [ ] No remaining `/app/dashboard` references
- [ ] No remaining `/app/tasks` references
- [ ] No remaining `/app/completed` references
- [ ] No remaining `/app/analytics` references
- [ ] No remaining `/app/settings` references

**Search Command to Find Remaining Issues:**

```bash
grep -r "/app/dashboard" frontend/
grep -r "/app/tasks" frontend/
grep -r "/app/completed" frontend/
grep -r "/app/analytics" frontend/
grep -r "/app/settings" frontend/
```

If these return no results, you're good to go!
