# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack

- **Runtime**: Bun (JavaScript/TypeScript runtime and package manager)
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite with React plugin
- **Routing**: React Router DOM
- **State Management**: React Context API with useReducer
- **Styling**: CSS with CSS Custom Properties (CSS Variables) and atomic classes

## Common Commands

- `bun dev` - Start development server on http://localhost:3000
- `bun run build` - Build production bundle
- `bun install` - Install dependencies
- `bun run lint` - Run ESLint
- `bun run test` - Run tests with Vitest
- `bun run preview` - Preview production build

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── DartBoard.tsx    # Interactive dartboard with clickable zones
│   ├── PlayerPanel.tsx  # Player list and scores display
│   └── Navigation.tsx   # Navigation component
├── pages/           # Route components
│   ├── GamePage.tsx     # Main game interface
│   └── SettingsPage.tsx # Player and game configuration
├── contexts/        # React Context providers
│   └── GameContext.tsx  # Game state management
├── types/           # TypeScript type definitions
│   └── index.ts         # Game interfaces and constants
├── styles/          # CSS files
│   ├── index.css        # Main styles with CSS variables
│   └── atoms.css        # Utility classes and animations
└── App.tsx          # Main app component with routing
```

## Game Logic Architecture

### Core Game Flow
1. **Setup**: Players are added in Settings page
2. **Game Start**: Game state initialized with starting scores (default 501)
3. **Turn Sequence**: Each player gets 3 darts per turn
4. **Scoring**: Click dartboard sectors to register hits, points deducted from player score
5. **Win Condition**: First player to reach exactly 0 points wins

### Key Components

**DartBoard.tsx**: Interactive SVG dartboard with mathematical sector calculation for clickable zones. Uses polar coordinate conversion to generate sector paths.

**GameContext.tsx**: Centralized state management using useReducer pattern. Handles:
- Player management (add/remove)
- Turn sequencing (3 darts per player)
- Score calculation and validation
- Game state transitions (playing/finished)

### CSS Architecture

The styles follow the kiro_test pattern with:
- **CSS Variables**: Comprehensive design system in `:root`
- **Darts Theme**: Green (#198754), Red (#dc3545), Gold (#ffc107) color palette
- **Atomic Classes**: Utility-first approach in `atoms.css`
- **Animations**: Keyframes for interactive feedback (dartboard spin, dart throw effects)

## Development Notes

### Adding New Features
- Follow existing TypeScript interface patterns in `types/index.ts`
- Use the GameContext for all game state modifications
- Maintain the atomic CSS approach for styling
- Add new routes in `App.tsx` and corresponding page components

### Dartboard Mathematics
- 20 sectors at 18° each arranged clockwise starting from 20 at top
- Concentric rings: singles (outer), triples (middle), doubles (inner edge)
- Bull: outer ring (25 points), inner ring (50 points)
- SVG coordinates calculated using polar-to-cartesian conversion

### State Management Principles
- Immutable state updates via reducer pattern
- Player turns tracked by `currentPlayerIndex` and `dartsThrown`
- Game rules validation in reducer (score limits, turn limits)
- History tracking through `throws` array for game analysis