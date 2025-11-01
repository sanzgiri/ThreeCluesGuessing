# Three Clues Game - Design Guidelines

## Core Principles

**Reference-Based Approach**: Inspired by Wordle, NYT Games, and Duolingo - emphasizing clarity, gamification, and delightful micro-interactions.

**Design Pillars**:
- Mobile-first, focused gameplay with minimal distractions
- Clear visual hierarchy separating content from UI chrome
- Rewarding celebration moments without disruption
- Gamification as motivational anchor (streaks, scores)

---

## Typography

### Fonts
- **Primary**: Inter (UI, buttons, labels)
- **Display**: Clash Display or Space Grotesk (headings, scores)

### Scale
- **Display**: 3.5rem/56px, weight 700 - Game titles, score reveals
- **H1**: 2.5rem/40px, weight 600 - Mode titles, round headers
- **H2**: 1.875rem/30px, weight 600 - Section headings
- **H3**: 1.5rem/24px, weight 500 - Clue numbers
- **Body Large**: 1.125rem/18px, weight 400 - Clues (line-height 1.6, letter-spacing -0.01em)
- **Body**: 1rem/16px, weight 400 - Secondary text
- **Small**: 0.875rem/14px - Labels, hints
- **Tiny**: 0.75rem/12px - Timestamps

**Special Formatting**:
- Game state labels: H3, uppercase, letter-spacing 0.05em
- Scores: Display font, tabular numbers
- Buttons: Body, weight 500, letter-spacing 0.01em

---

## Layout & Spacing

### Spacing Scale (Tailwind)
Primary values: **2, 3, 4, 6, 8, 12, 16, 20, 24**
- Component padding: p-4, p-6, p-8
- Section gaps: gap-4, gap-6, gap-8
- Major margins: my-12, my-16, my-20
- Buttons: px-6 py-3 (standard), px-8 py-4 (large)

### Containers & Grids
- **Max-widths**: max-w-md (gameplay), max-w-2xl (results), max-w-6xl (home)
- **Breakpoints**: md:768px, lg:1024px (mobile-first)
- **Card grids**: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

### Key Layouts

**Home**: Centered max-w-2xl, header with stats, hero Daily Challenge, mode cards grid, footer preview

**Round**: Centered max-w-md, top bar (category, progress, close), clue card (min-h-[240px]), centered actions, optional timer top-right

**Results**: Centered max-w-lg, large answer reveal, score breakdown card, action buttons, next challenge teaser

**Leaderboard**: max-w-3xl, tabs (Daily/All-Time/Friends), rank list with highlighted user position

---

## Components

### Cards

**Base**: rounded-xl, p-6 (mobile)/p-8 (desktop), subtle shadow, 1px border

**Clue Card**: p-8 md:p-12, min-h-[240px], centered content, clue number badge top-left, Body Large centered text (max 3 lines)

**Mode Cards**: Grid layout, 60px icon, H2 title, Body description, hover lift (translate-y-1), p-6, full-card clickable

**Score Card**: Labeled rows, border-t dividers, Display font for total, streak indicator with icon

### Buttons

**Primary**: px-6 py-3 (medium)/px-8 py-4 (large), Body weight 500, rounded-lg, min-w-[140px], full-width mobile CTAs

**Secondary**: Same sizing, 2px border, transparent background

**Icon**: w-10 h-10 (small)/w-12 h-12 (medium), rounded-lg, 20px/24px Heroicons

**On Image**: backdrop-blur-md, 1px border with opacity

### Forms

**Guess Input**: text-lg, px-4 py-3, rounded-lg, full-width
- Autocomplete: Elevated, rounded-lg, max-h-60 overflow-y-auto, px-4 py-3 items with hover

**Search**: Same styling, icon prefix, helpful placeholder

### Navigation

**Top Bar**: h-14, sticky top-0, px-4, flex items-center justify-between (category left, progress center, close right)

**Bottom Nav**: h-16, 24px icons + labels (Home, Arcade, Stats, Profile), clear active state

### Progress & Status

**Clue Progress**: Dots/numbered steps, w-8 h-8 per step, gap-2, emphasized current step

**Streak Counter**: Flame icon + number, header placement, milestone animation

**Loading**: 24px spinner (inline)/40px (full-screen), skeleton cards, smooth opacity

### Overlays

**Modal**: max-w-md, p-6 md:p-8, semi-transparent backdrop, centered fixed, close button top-right

**Toast**: Bottom-center, px-4 py-3, rounded-lg, icon + message, auto-dismiss 3-5s

### Data Display

**Leaderboard**: py-3 px-4 items, border-b separators, grid (rank | name flex-1 | score), highlighted user row

**Stats Grid**: 2-col mobile/3-4-col desktop, icon + Display number + Small label, centered, gap-4

**Achievements**: Icon/emoji, label below, reduced opacity when locked, grid-cols-2 md:grid-cols-3 lg:grid-cols-4

---

## Animation & Interaction

### Timing
- **Fast**: 150ms (hover, active)
- **Medium**: 200-250ms (reveals, navigation)
- **Celebration**: 400-600ms (confetti, success)

### Key Patterns

**Clue Reveal**: Card flip (rotateY 180deg), 400ms ease-in-out, stagger multiple elements

**Correct Guess**: Scale pulse (scale-105), confetti burst, 300ms fade + slide to results

**Page Transitions**: Slide right (forward), slide left (back), fade for mode switches, 250ms

**Streak Milestone**: Flame bounce, subtle glow, sound hook

**Haptics** (placeholder): Light (press), medium (submit), success pattern (correct), gentle pulse (milestone)

---

## Accessibility

### Focus & Keyboard
- 2px outline offset on all interactive elements, focus-visible for keyboard
- Skip to main content link
- Logical tab order, auto-focus guess input, ESC closes modals

### Contrast & Clarity
- 4.5:1 body text, 3:1 large text
- Icon buttons have aria-labels
- No color-only state indication

### Screen Readers
- Announce "Clue 1 of 3", score updates
- Modal focus trapping
- Proper heading hierarchy (h1 → h2 → h3)

---

## Visual Assets

### Icons (Heroicons, outlined)
- **Game**: Trophy, fire, star, clock
- **Navigation**: Home, chart-bar, user-circle
- **Actions**: Arrow-right, check, x-mark, refresh
- **Sizes**: 20px (small), 24px (medium), 32px (large)

### Images

**Person Images**: 120px × 120px (mobile)/160px × 160px (desktop), rounded-full or rounded-xl, centered above name, initials fallback

**Category Icons** (optional): 40px × 40px, minimal icon-style, displayed with labels

**Celebration**: CSS/SVG confetti particles, trophy/badge illustrations

---

## Responsive Breakpoints

**Mobile (<768px)**: Single column, full-width buttons, bottom nav, min 44px touch targets, minimal horizontal padding

**Tablet (768-1024px)**: 2-column grids, larger padding, max-width constrained clues, horizontal tab nav

**Desktop (1024px+)**: Multi-column, full hover states, larger headings, generous whitespace (py-20, py-24)

---

## Special States

**Daily Challenge Lock**: "Come back tomorrow!" message, countdown timer, today's score prominent, Arcade mode CTA

**Streak Warning**: Header counter always visible, warning if >1 day, celebration at milestones (3, 7, 30 days)

**Offline**: Subtle badge, limited functionality messaging, Arcade mode fully functional

**Empty States**: 
- No games: Welcome + first game CTA
- No achievements: Preview locked with encouragement
- No friends: Invite CTA or global leaderboard

---

**Touch Targets**: Minimum 44px × 44px for all interactive elements on mobile.