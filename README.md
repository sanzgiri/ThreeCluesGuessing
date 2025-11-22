# Three Clues – Daily Guessing Game

Three Clues is a web game where players reveal up to three progressively specific hints to identify a hidden person. Earlier guesses earn more points, daily puzzles track streaks, and Arcade mode offers unlimited practice.

## Tech Stack

- **Client**: React + TypeScript via Vite, Tailwind CSS, shadcn/ui, Framer Motion
- **Server**: Express + WebSockets, bundled with esbuild/tsx
- **Data**: Local JSON for clues, Drizzle ORM schemas ready for Postgres (e.g., Neon)
- **State**: React Query + localStorage for persistence

```
three-clues/
├── client/             # React UI
├── server/             # Express API + Vite middleware
├── shared/             # Reusable schemas & types
├── render.yaml         # Render deployment blueprint
└── README.md
```

## Game Modes

| Mode            | Details |
|-----------------|---------|
| **Daily**       | One shared puzzle per day, streak + milestone tracking |
| **Arcade**      | Endless random puzzles, perfect for practice |
| **Future**      | Versus + social modes planned |

Points: 3 (Clue 1), 2 (Clue 2), 1 (Clue 3). Streak bonus adds +1 per consecutive win (cap +7).

## Local Development

```bash
# Install dependencies
npm install

# Start Express + Vite dev server (defaults to http://localhost:5000)
npm run dev

# Build production assets + server bundle
npm run build

# Run the compiled server (uses dist/index.js)
npm start
```

Environment variables (optional for now):

- `DATABASE_URL`: Postgres connection string if you migrate from in-memory storage
- `SESSION_SECRET`: Secret for session middleware (set before deploying)

## Render Deployment

1. Push this repository to GitHub.
2. In Render, create a **Web Service** from the repo or use the included `render.yaml`.
3. Set the service to use Node 20+. Render runs `npm install && npm run build` followed by `npm run start`.
4. Configure environment variables under **Environment**:
   - `NODE_ENV=production`
   - `SESSION_SECRET=your-secure-string`
   - `DATABASE_URL=postgres://...` (Neon or Render Postgres)
5. Deploy. Render automatically injects `PORT`, which the server already respects.

### render.yaml

```yaml
services:
  - type: web
    name: three-clues-guessing
    runtime: node
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npm run start
    autoDeploy: true
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        sync: false
      - key: SESSION_SECRET
        sync: false
```

## GitHub Checklist

1. Ensure `.gitignore` keeps `node_modules`, build outputs, and any local Replit artifacts out of version control.
2. Run `npm run build` locally (CI step suggestion) to catch type issues before pushing.
3. Commit and push to your GitHub repo; Render can auto-deploy on new commits.

## Future Enhancements

- User accounts + cloud persistence
- Versus and social challenges
- Themed content packs, achievements, push notifications, and PWA install support

Happy guessing! 🎯
