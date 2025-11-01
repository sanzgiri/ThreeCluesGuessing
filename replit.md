# Three Clues - Daily Guessing Game

## Overview

Three Clues is a progressive web application (PWA) where players guess a hidden person from up to three progressively specific clues. The game features daily challenges, endless arcade mode, and streak tracking to encourage daily engagement.

**Core Mechanic**: Players see clues one at a time, from broad to specific, and can guess after each clue. Earlier correct guesses earn more points.

## Project Architecture

### Tech Stack

- **Frontend**: React + TypeScript, Vite, Tailwind CSS
- **UI Components**: Shadcn UI with custom components
- **Animations**: Framer Motion for smooth transitions and celebrations
- **Routing**: Wouter for client-side navigation
- **State Management**: React hooks with localStorage for persistence
- **Data Storage**: In-memory storage with localStorage for user stats

### Project Structure

```
three-clues/
├── client/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── StatsCard.tsx           # User statistics display
│   │   │   ├── ModeCard.tsx            # Game mode selection cards
│   │   │   ├── ClueCard.tsx            # Clue reveal component
│   │   │   ├── ProgressIndicator.tsx   # 3-step progress dots
│   │   │   ├── GuessInput.tsx          # Autocomplete guess input
│   │   │   ├── ResultCard.tsx          # Game result display
│   │   │   ├── Confetti.tsx            # Victory celebration
│   │   │   ├── StreakMilestone.tsx     # Milestone celebrations
│   │   │   └── CategoryPreview.tsx     # Category badge display
│   │   ├── pages/               # Route pages
│   │   │   ├── Home.tsx                # Main menu and stats
│   │   │   ├── GameRound.tsx           # Active game session
│   │   │   └── not-found.tsx           # 404 page
│   │   ├── data/                # Static data
│   │   │   ├── people.json             # 72 person database (JSON format)
│   │   │   └── peopleHelpers.ts        # Helper functions for people data
│   │   ├── lib/                 # Utilities
│   │   │   ├── storage.ts              # localStorage helpers
│   │   │   └── queryClient.ts          # React Query config
│   │   └── App.tsx              # Root component with routing
│   └── index.html               # Entry HTML
├── shared/
│   ├── types.ts                 # TypeScript types
│   └── schema.ts                # Database schema (unused in MVP)
├── server/
│   ├── routes.ts                # Express routes (minimal)
│   └── storage.ts               # Storage interface
└── design_guidelines.md         # UI/UX design system
```

## Game Mechanics

### Scoring System

| Clue Level | Points Awarded |
|------------|----------------|
| Clue 1     | 3 points       |
| Clue 2     | 2 points       |
| Clue 3     | 1 point        |
| Wrong      | 0 points       |

**Streak Bonus**: +1 point per consecutive daily win (capped at +7)

**Example**: Getting clue 2 correct with a 5-day streak = 2 + 5 = 7 total points

### Game Modes

#### Daily Challenge
- One puzzle per day, same for all players globally
- Determined by seeded random selection based on date
- One attempt per player per day
- Streak tracking for consecutive daily completions
- Locked after completion until next day

#### Arcade Mode
- Endless random puzzles from the full database
- No daily restrictions
- Perfect for practice and exploration
- Contributes to total score but not daily streaks

#### Versus Mode (Future)
- Asynchronous friend challenges
- Both players get the same three clues
- Fastest + earliest correct guess wins

### Streak System

**Milestones with Celebrations**:
- **3 Days**: "On Fire!" 🔥
- **7 Days**: "Unstoppable!" ⚡
- **30 Days**: "Legend!" 🏆

**Streak Rules**:
- Increments on each daily challenge completion
- Resets to 0 if a day is missed or answer is wrong
- Best streak is tracked separately

## Data Model

### Person Entity

```typescript
interface Person {
  id: string;                    // Unique identifier
  name: string;                  // Full name (answer)
  category: string;              // Historical Figure | Actor | Athlete | Character
  clues: [string, string, string]; // Exactly 3 clues, ordered broad → specific
  imageUrl?: string;             // Optional image (unused in MVP)
  metadata?: {
    aliases?: string[];          // Alternative names for matching
    birthYear?: number;          // Historical context
    works?: string[];            // Notable achievements
  };
}
```

### User Stats

```typescript
interface UserStats {
  totalScore: number;            // Cumulative points across all games
  streak: number;                // Current consecutive daily wins
  lastPlayedDate: string | null; // ISO date of last daily challenge
  gamesPlayed: number;           // Total rounds completed
  bestStreak: number;            // Highest streak achieved
}
```

### Content Guidelines

**Clue Gradient**: Each clue must escalate in specificity:
1. **Clue 1** (Broad): Background, era, field of work, general achievement
2. **Clue 2** (Specific): Major accomplishments, notable works, key relationships
3. **Clue 3** (Obvious): Name hints, iconic quotes, unmistakable identifiers

**Categories**:
- **Historical Figure**: Multiple entries
- **Actor**: Multiple entries
- **Athlete**: Multiple entries
- **Character**: Multiple entries

**Total Content**: 72 unique people stored in `client/src/data/people.json`

## Game Flow

### Daily Challenge Flow

```
Home Page
  ↓
[Check if played today]
  ├─ Yes → Lock daily mode, show "Come back tomorrow"
  └─ No → Allow access
       ↓
  Game Round (Daily Mode)
       ↓
  Reveal Clue 1 (broad)
       ↓
  [Player can guess OR reveal Clue 2]
       ↓
  Reveal Clue 2 (specific)
       ↓
  [Player can guess OR reveal Clue 3]
       ↓
  Reveal Clue 3 (obvious)
       ↓
  [Player must guess]
       ↓
  Result Screen
    - Show correct answer
    - Award points (3/2/1 + streak bonus)
    - Update streak
    - Check for milestone (3/7/30 days)
    - Show confetti if correct
    - Show milestone celebration if applicable
       ↓
  Lock daily mode
  Return to Home
```

### Arcade Mode Flow

```
Home Page
  ↓
Arcade Mode (always available)
  ↓
Game Round (random person)
  ↓
[Same clue progression as daily]
  ↓
Result Screen
  ↓
[Option: Play Again]
  ├─ Yes → New random person
  └─ No → Return to Home
```

## Local Storage

### Keys Used

| Key | Purpose | Format |
|-----|---------|--------|
| `three-clues-stats` | User statistics | JSON object (UserStats) |
| `three-clues-daily-played` | Last daily completion date | ISO date string (YYYY-MM-DD) |

### Data Persistence

- All user data stored client-side in localStorage
- No backend database required for MVP
- Stats persist across sessions
- No user accounts or authentication needed

## UI/UX Features

### Accessibility

- **ARIA Labels**: All interactive elements have descriptive labels
- **Semantic HTML**: Proper use of `<header>`, `<main>`, roles
- **Keyboard Navigation**: Full keyboard support with Enter to submit
- **Screen Reader Support**: Live regions announce game state changes
- **Focus Management**: Auto-focus on guess input for quick play
- **Color Contrast**: WCAG AA compliant color schemes

### Responsive Design

- **Mobile-first**: Optimized for phones (320px+)
- **Tablet**: Enhanced layout at 768px+ breakpoint
- **Desktop**: Maximum content width with generous spacing at 1024px+
- **Touch Targets**: Minimum 44px × 44px on mobile

### Animations

- **Clue Reveal**: Fade-in with subtle slide (400ms)
- **Confetti**: Particle burst on correct answers (2s duration)
- **Milestone Modal**: Scale-up spring animation with auto-dismiss
- **Page Transitions**: Smooth navigation (250ms)
- **Progress Steps**: Ring indicator for current step

### Dark Mode Support

- CSS variables for theme switching (ready but not implemented)
- All colors use HSL values with alpha channel support
- Design system supports both light and dark themes

## Content Management

### Adding New People

To add a new person to the game:

1. Open `client/src/data/people.json`
2. Add a new entry to the JSON array:

```json
{
  "id": "unique_001",
  "name": "Full Name",
  "category": "Historical Figure",
  "clues": [
    "Broad clue about era, field, and general impact",
    "Specific achievements, works, or relationships",
    "Obvious hint with name or unmistakable identifier"
  ]
}
```

3. Test the clues:
   - Can multiple people fit Clue 1? (Should be possible but narrow)
   - Does Clue 2 significantly narrow the options?
   - Is Clue 3 unmistakable?

**Note**: The data is stored in JSON format for easy editing. A helper file (`peopleHelpers.ts`) loads the JSON and provides utility functions like `getRandomPerson()`, `getDailyPerson()`, and `findPersonByName()`.

### Content Quality Gates

- ✅ All 3 clues are factually accurate
- ✅ Clues escalate in specificity (broad → specific → obvious)
- ✅ No profanity or sensitive content
- ✅ Person is recognizable to a general audience
- ✅ No duplicate clue sets across different people
- ✅ Category is correctly assigned

## Development

### Running Locally

```bash
# Install dependencies
npm install

# Start development server (port 5000)
npm run dev

# Build for production
npm run build
```

### Environment Variables

No environment variables required for the MVP. All configuration is hardcoded.

### Testing

The application includes `data-testid` attributes on all interactive elements for easy E2E testing with Playwright or similar frameworks.

**Key Test IDs**:
- `input-guess` - Guess input field
- `button-submit-guess` - Submit button
- `button-reveal-clue` - Reveal next clue button
- `button-play-again` - Play again button
- `text-answer` - Correct answer display
- `text-total-score` - Total score display
- `text-streak` - Current streak display

## Future Enhancements

### Phase 2: Social Features
- Versus mode with shareable deep links
- Global leaderboard (requires backend)
- Friend challenges
- Share results to social media

### Phase 3: Gamification
- Achievement badges (First Clue Master, Speed Demon, etc.)
- XP system and levels
- Daily/weekly challenges with special rewards
- Avatar customization

### Phase 4: Content Expansion
- User-submitted clues (with moderation)
- Themed content packs (Movies, Sports, History, etc.)
- Difficulty settings (Easy, Medium, Hard)
- Localization for multiple languages

### Phase 5: PWA Features
- Service worker for offline gameplay
- Install prompt for mobile/desktop
- Push notifications for daily reminders
- Background sync for stats

## Performance Considerations

- **Initial Load**: < 2s on mid-range devices (target)
- **Interaction Response**: < 200ms for all UI actions
- **Bundle Size**: Optimized with Vite tree-shaking
- **Asset Optimization**: Minimal external dependencies

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Android Chrome 90+
- **Progressive Enhancement**: Core gameplay works without JavaScript (future)

## License & Attribution

Content about real people is factual information. No rights are claimed over the names or likenesses of actual persons. Fictional characters are property of their respective copyright holders and used for educational/entertainment purposes.

---

**Last Updated**: November 2025
**Version**: 1.0.0 (MVP)
