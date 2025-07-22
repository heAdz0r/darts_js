# Project Structure & Architecture

## Directory Organization

```
src/
├── components/          # Reusable React components
│   ├── DartBoard.tsx   # Interactive dart board with click handling
│   ├── DartsIcon.tsx   # SVG dart icon component
│   ├── Footer.tsx      # Application footer
│   ├── Header.tsx      # Navigation header
│   ├── Layout.tsx      # Main layout wrapper
│   └── PlayerPanel.tsx # Player score and status display
├── contexts/           # React Context providers
│   └── GameContext.tsx # Global game state management
├── hooks/              # Custom React hooks (currently empty)
├── pages/              # Route-level page components
│   ├── GamePage.tsx    # Main game interface
│   └── SettingsPage.tsx # Game configuration
├── styles/             # CSS styling
│   ├── atoms.css       # Atomic/utility classes
│   └── index.css       # Global styles and CSS variables
├── types/              # TypeScript type definitions
│   └── index.ts        # Core game types and interfaces
├── App.tsx             # Root component with routing
└── main.tsx            # Application entry point
```

## Architecture Patterns

### State Management

- **React Context + useReducer**: Centralized game state in `GameContext`
- **Immutable Updates**: All state changes through reducer actions
- **Type Safety**: Comprehensive TypeScript interfaces for all game entities

### Component Architecture

- **Functional Components**: All components use React hooks
- **Props Interfaces**: Every component has typed props interface
- **Layout Pattern**: `Layout` component wraps page content with header/footer
- **Composition**: Components composed through children props

### File Naming Conventions

- **Components**: PascalCase (`DartBoard.tsx`)
- **Pages**: PascalCase with "Page" suffix (`GamePage.tsx`)
- **Hooks**: camelCase with "use" prefix (`useGameLogic.ts`)
- **Types**: camelCase interfaces, PascalCase for types
- **Constants**: UPPER_SNAKE_CASE

### Import Patterns

- Use path aliases (`@/components/Component` instead of `../components/Component`)
- Group imports: React imports first, then third-party, then local
- Named exports preferred over default exports for utilities

## Key Type Definitions

### Core Game Types

- `Player`: Individual player state and metadata
- `DartThrow`: Single dart throw with sector, multiplier, points
- `GameState`: Complete game state including players, throws, settings
- `GameSettings`: Configuration for game rules and parameters

### Game Logic

- **Turn Management**: 3 darts per player turn with automatic rotation
- **Score Validation**: Bust prevention and double-out rule enforcement
- **Game Rules**: Configurable starting score, double-out requirement
- **Undo System**: Last throw can be undone with state restoration

## Styling Architecture

- **CSS Modules**: Component-scoped styling to prevent conflicts
- **Atomic Classes**: Utility classes in `atoms.css` for common patterns
- **CSS Variables**: Consistent colors and spacing defined in `index.css`
- **BEM Methodology**: Block-Element-Modifier naming for CSS classes

## State Flow

1. User interactions trigger context actions
2. GameContext reducer processes actions immutably
3. Components re-render based on updated state
4. Game rules enforced at reducer level
5. UI reflects current game state automatically
