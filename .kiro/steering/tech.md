# Technology Stack & Build System

## Core Technologies

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5 (fast development and optimized production builds)
- **Routing**: React Router DOM v6
- **Styling**: CSS Modules for component-scoped styles
- **Testing**: Vitest (Vite-native testing framework)
- **Linting**: ESLint with TypeScript and React rules
- **Package Manager**: npm (supports yarn, pnpm, bun alternatives)

## Development Environment

- **Node.js**: 16.0+ required
- **TypeScript**: Strict mode enabled with comprehensive type checking
- **Hot Module Replacement**: Instant updates during development via Vite

## Path Aliases

Configured aliases for clean imports:

- `@/` → `src/`
- `@/components/` → `src/components/`
- `@/pages/` → `src/pages/`
- `@/types/` → `src/types/`
- `@/styles/` → `src/styles/`

## Common Commands

### Development

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Production build with TypeScript compilation
npm run preview      # Preview production build locally
```

### Code Quality

```bash
npm run lint         # Run ESLint checks
npm run lint -- --fix # Auto-fix ESLint issues
npm run test         # Run test suite
npm run test -- --watch # Run tests in watch mode
```

### Utilities

```bash
npx tsc --noEmit     # Type check without compilation
rm -rf node_modules/.vite # Clear Vite cache
```

## Build Configuration

- **Vite Config**: Custom aliases, React plugin, dev server on port 3000
- **TypeScript**: Strict mode, unused variable detection, comprehensive error checking
- **ESLint**: TypeScript rules, React Hooks rules, React Refresh compatibility

## Browser Support

- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- ES2020 target with modern JavaScript features
