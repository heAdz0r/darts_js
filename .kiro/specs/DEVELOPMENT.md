# 🛠️ Руководство для разработчиков

Это руководство поможет настроить среду разработки для проекта Darts Game.

## Быстрый старт для разработчиков

```bash
# Клонирование и установка
git clone <repository-url>
cd darts-game
npm install

# Запуск в режиме разработки
npm run dev
```

## Архитектура проекта

### Технологический стек

- **Frontend Framework**: React 18 с TypeScript
- **Build Tool**: Vite 5
- **Routing**: React Router DOM v6
- **Styling**: CSS Modules
- **Testing**: Vitest
- **Linting**: ESLint с TypeScript правилами
- **Package Manager**: npm (поддерживается yarn, pnpm, bun)

### Структура директорий

```
darts-game/
├── public/                 # Статические ресурсы
│   └── vite.svg           # Иконки и изображения
├── src/
│   ├── components/        # React компоненты
│   │   ├── DartBoard.tsx  # Интерактивная доска дартса
│   │   ├── DartsIcon.tsx  # Иконка дартса
│   │   ├── Footer.tsx     # Подвал приложения
│   │   ├── Header.tsx     # Заголовок приложения
│   │   ├── Layout.tsx     # Основной макет
│   │   └── PlayerPanel.tsx # Панель игрока
│   ├── contexts/          # React контексты
│   │   └── GameContext.tsx # Контекст игрового состояния
│   ├── hooks/             # Пользовательские хуки
│   ├── pages/             # Страницы приложения
│   │   ├── GamePage.tsx   # Страница игры
│   │   └── SettingsPage.tsx # Страница настроек
│   ├── styles/            # CSS стили
│   │   ├── atoms.css      # Атомарные стили
│   │   └── index.css      # Глобальные стили
│   ├── types/             # TypeScript типы
│   │   └── index.ts       # Основные типы
│   ├── App.tsx            # Главный компонент
│   └── main.tsx           # Точка входа
├── dist/                  # Собранные файлы (генерируется)
├── node_modules/          # Зависимости (генерируется)
├── index.html             # HTML шаблон
├── package.json           # Конфигурация проекта
├── tsconfig.json          # Конфигурация TypeScript
├── tsconfig.node.json     # TypeScript для Node.js
└── vite.config.ts         # Конфигурация Vite
```

## Настройка среды разработки

### Системные требования

- Node.js 16.0+
- npm 7.0+ (или альтернативный пакетный менеджер)
- Git
- Современный браузер (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

### Рекомендуемые инструменты

#### Редакторы кода

**Visual Studio Code** (рекомендуется)

```bash
# Установка через Homebrew (macOS)
brew install --cask visual-studio-code

# Или скачайте с https://code.visualstudio.com/
```

**Рекомендуемые расширения для VS Code:**

- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens
- Thunder Client (для API тестирования)

#### Браузерные инструменты

- **React Developer Tools** - для отладки React компонентов
- **Redux DevTools** - если будет добавлен Redux

### Конфигурация проекта

#### TypeScript

Проект использует строгую конфигурацию TypeScript:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

#### Алиасы путей

Настроены алиасы для удобного импорта:

```typescript
// Вместо относительных путей
import Component from "../../../components/Component";

// Используйте алиасы
import Component from "@/components/Component";
```

Доступные алиасы:

- `@/` → `src/`
- `@/components/` → `src/components/`
- `@/pages/` → `src/pages/`
- `@/types/` → `src/types/`
- `@/styles/` → `src/styles/`

#### ESLint конфигурация

Проект использует строгие правила линтинга:

- TypeScript ESLint правила
- React Hooks правила
- React Refresh правила

## Команды разработки

### Основные команды

```bash
# Запуск сервера разработки
npm run dev

# Сборка для продакшена
npm run build

# Предварительный просмотр сборки
npm run preview

# Проверка кода линтером
npm run lint

# Запуск тестов
npm run test

# Запуск тестов в watch режиме
npm run test -- --watch
```

### Дополнительные команды

```bash
# Проверка типов TypeScript
npx tsc --noEmit

# Автоматическое исправление ESLint ошибок
npm run lint -- --fix

# Анализ размера бандла
npm run build -- --analyze

# Очистка кэша
rm -rf node_modules/.vite
```

## Рабочий процесс разработки

### 1. Создание новой функции

```bash
# Создайте новую ветку
git checkout -b feature/new-feature-name

# Внесите изменения
# Добавьте тесты
# Проверьте линтером
npm run lint

# Запустите тесты
npm run test

# Создайте коммит
git add .
git commit -m "feat: add new feature description"
```

### 2. Структура компонентов

Следуйте этой структуре для новых компонентов:

```typescript
// src/components/NewComponent.tsx
import React from "react";
import styles from "./NewComponent.module.css";

interface NewComponentProps {
  // Определите пропсы
}

export const NewComponent: React.FC<NewComponentProps> = (
  {
    // деструктуризация пропсов
  }
) => {
  return <div className={styles.container}>{/* JSX содержимое */}</div>;
};

export default NewComponent;
```

### 3. Добавление новых типов

```typescript
// src/types/index.ts
export interface GameState {
  // Определите интерфейс
}

export type GameMode = "501" | "cricket";
```

### 4. Создание хуков

```typescript
// src/hooks/useGameLogic.ts
import { useState, useCallback } from "react";

export const useGameLogic = () => {
  const [state, setState] = useState();

  const action = useCallback(() => {
    // логика хука
  }, []);

  return { state, action };
};
```

## Стандарты кодирования

### TypeScript

- Используйте строгую типизацию
- Избегайте `any`, предпочитайте `unknown`
- Определяйте интерфейсы для всех объектов
- Используйте enum для констант

### React

- Используйте функциональные компоненты с хуками
- Мемоизируйте дорогие вычисления с `useMemo`
- Мемоизируйте колбэки с `useCallback`
- Используйте `React.FC` для типизации компонентов

### CSS

- Используйте CSS Modules для стилизации
- Следуйте BEM методологии для именования классов
- Используйте CSS переменные для цветов и размеров

### Именование

- Компоненты: PascalCase (`GameBoard`)
- Файлы компонентов: PascalCase (`GameBoard.tsx`)
- Хуки: camelCase с префиксом `use` (`useGameState`)
- Константы: UPPER_SNAKE_CASE (`MAX_PLAYERS`)
- Переменные и функции: camelCase (`playerScore`)

## Тестирование

### Настройка тестов

Проект использует Vitest для тестирования:

```typescript
// src/components/__tests__/Component.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Component from "../Component";

describe("Component", () => {
  it("should render correctly", () => {
    render(<Component />);
    expect(screen.getByText("Expected Text")).toBeInTheDocument();
  });
});
```

### Запуск тестов

```bash
# Однократный запуск
npm run test

# Watch режим
npm run test -- --watch

# С покрытием кода
npm run test -- --coverage
```

## Отладка

### Отладка в браузере

1. Откройте DevTools (F12)
2. Используйте React Developer Tools
3. Установите breakpoints в Sources

### Отладка в VS Code

1. Установите расширение "Debugger for Chrome"
2. Создайте конфигурацию `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "request": "launch",
      "type": "chrome",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

## Производительность

### Оптимизация сборки

- Vite автоматически оптимизирует сборку
- Используйте динамические импорты для code splitting
- Оптимизируйте изображения

### Мониторинг производительности

```bash
# Анализ размера бандла
npm run build
npx vite-bundle-analyzer dist
```

## Развертывание

### Локальная сборка

```bash
npm run build
npm run preview
```

### Переменные окружения

Создайте файлы для разных окружений:

```bash
# .env.local
VITE_API_URL=http://localhost:3001

# .env.production
VITE_API_URL=https://api.production.com
```

## Полезные ресурсы

### Документация

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Vitest Documentation](https://vitest.dev/)

### Инструменты

- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Can I Use](https://caniuse.com/) - проверка поддержки браузерами

## Решение проблем

### Частые проблемы

**Проблема**: TypeScript ошибки после обновления зависимостей

```bash
# Решение
rm -rf node_modules package-lock.json
npm install
```

**Проблема**: Медленная сборка

```bash
# Очистка кэша Vite
rm -rf node_modules/.vite
```

**Проблема**: ESLint конфликты

```bash
# Автоматическое исправление
npm run lint -- --fix
```

### Получение помощи

1. Проверьте документацию выше
2. Поищите в Issues репозитория
3. Создайте новый Issue с подробным описанием проблемы
4. Обратитесь к команде разработки
