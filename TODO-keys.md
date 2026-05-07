# Fix Duplicate React Key Warning

## Steps
- [x] Step 1: Edit src/app/create-goal/page.tsx - Use crypto.randomUUID() for goal.id

- [x] Step 2: Edit src/app/plans/page.tsx - Add dedupe + fallback key in map

- [ ] Step 3: Clear localStorage goals for clean state
- [ ] Step 4: Verify no warnings after npm run dev + create goals

Step 3: Clear localStorage for clean test data. Run this in browser console: localStorage.removeItem('goals'); location.reload();

