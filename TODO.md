# Plans Page Redesign - TODO

## Current State Analysis
- AI Tips: Always visible, orange gradient, distracting
- Theme System: Basic dark/light themes with CSS variables
- PlanCard: Basic hover, simple progress bar
- Add Button: Aggressive accent color with glow

## Implementation Plan

### 1. Theme System Expansion (globals.css)
- [x] Add green theme (finance, growth)
- [x] Add purple theme (AI, modern tech)
- [x] Add beige/light theme (premium minimal)
- [x] Keep default dark theme
- [x] Add CSS transitions for theme switching

### 2. Reusable Components
- [x] Create AiTipCard (collapsible, glassmorphism, subtle style)
- [x] Create PlanCard (improved hover effects, theme-based progress)
- [x] Create ProgressBar (animated fill, gradient based on theme)
- [x] Create FloatingAddButton (softer glow, pulse animation)

### 3. Plans Page Integration
- [x] Replace current AI Tips with collapsible component
- [x] Integrate new PlanCard component
- [x] Add micro-interactions and smooth transitions

### 4. UX Improvements
- [x] Hover effects on cards
- [x] Smooth height/opacity animations
- [x] Theme-aware colors throughout

## Files to Modify/Create
- src/app/globals.css (expand themes)
- src/components/plans/AiTipCard.tsx (new)
- src/components/plans/PlanCard.tsx (new)
- src/components/plans/ProgressBar.tsx (new)
- src/components/plans/FloatingAddButton.tsx (new)
- src/app/plans/page.tsx (integrate components)

## Status: COMPLETE ✅

---

## Implementation Summary

### Files Created:
1. `src/components/plans/AiTipCard.tsx` - Collapsible AI tip with glassmorphism
2. `src/components/plans/ProgressBar.tsx` - Animated progress bar with theme colors
3. `src/components/plans/PlanCard.tsx` - Modern plan card with hover effects
4. `src/components/plans/FloatingAddButton.tsx` - Soft pulse animation button

### Files Modified:
1. `src/app/globals.css` - Expanded theme system (dark/green/purple/beige)
2. `src/app/plans/page.tsx` - Integrated new components

### Theme Colors:
- **Dark** (default): Primary #FF4D4D (red)
- **Green**: Primary #22C55E (finance/growth)
- **Purple**: Primary #A855F7 (AI/tech)
- **Beige**: Primary #B8860B (premium minimal)
