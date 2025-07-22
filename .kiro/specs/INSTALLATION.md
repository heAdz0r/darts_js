# 📦 Руководство по установке Darts Game

Это подробное руководство по установке и настройке веб-приложения Darts Game.

## Системные требования

### Обязательные требования

- **Node.js**: версия 16.0 или выше
- **npm**: версия 7.0 или выше (входит в состав Node.js)
- **Git**: для клонирования репозитория

### Альтернативные пакетные менеджеры

- **Yarn**: версия 1.22+ или Yarn 2+
- **pnpm**: версия 7.0+
- **Bun**: версия 1.0+ (обнаружен в проекте)

### Поддерживаемые операционные системы

- Windows 10/11
- macOS 10.15+
- Linux (Ubuntu 18.04+, CentOS 7+, или аналогичные)

## Проверка системы

Перед установкой убедитесь, что у вас установлены необходимые инструменты:

```bash
# Проверка версии Node.js
node --version

# Проверка версии npm
npm --version

# Проверка версии Git
git --version
```

Ожидаемый вывод:

```
v18.17.0  # или выше
9.6.7     # или выше
git version 2.34.1  # любая современная версия
```

## Установка Node.js

Если Node.js не установлен, выберите один из способов:

### Способ 1: Официальный сайт

1. Перейдите на https://nodejs.org/
2. Скачайте LTS версию для вашей ОС
3. Запустите установщик и следуйте инструкциям

### Способ 2: Через пакетный менеджер

**Windows (Chocolatey):**

```bash
choco install nodejs
```

**macOS (Homebrew):**

```bash
brew install node
```

**Linux (Ubuntu/Debian):**

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Способ 3: Node Version Manager (рекомендуется для разработчиков)

**nvm (Linux/macOS):**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
nvm use --lts
```

**nvm-windows:**

1. Скачайте с https://github.com/coreybutler/nvm-windows/releases
2. Установите и перезапустите терминал
3. Выполните:

```bash
nvm install lts
nvm use lts
```

## Установка проекта

### Шаг 1: Клонирование репозитория

```bash
# Клонирование через HTTPS
git clone https://github.com/your-username/darts-game.git

# Или через SSH (если настроен)
git clone git@github.com:your-username/darts-game.git

# Переход в директорию проекта
cd darts-game
```

### Шаг 2: Установка зависимостей

Выберите один из пакетных менеджеров:

**npm (по умолчанию):**

```bash
npm install
```

**Yarn:**

```bash
yarn install
```

**pnpm:**

```bash
pnpm install
```

**Bun (быстрая альтернатива):**

```bash
bun install
```

### Шаг 3: Проверка установки

Убедитесь, что все зависимости установлены корректно:

```bash
# Проверка структуры проекта
ls -la

# Должны присутствовать:
# - node_modules/
# - src/
# - public/
# - package.json
# - vite.config.ts
```

## Запуск приложения

### Режим разработки

```bash
# npm
npm run dev

# yarn
yarn dev

# pnpm
pnpm dev

# bun
bun run dev
```

После запуска приложение будет доступно по адресу: http://localhost:3000

### Сборка для продакшена

```bash
# npm
npm run build

# yarn
yarn build

# pnpm
pnpm build

# bun
bun run build
```

Собранные файлы будут находиться в папке `dist/`

### Предварительный просмотр продакшен-сборки

```bash
# npm
npm run preview

# yarn
yarn preview

# pnpm
pnpm preview

# bun
bun run preview
```

## Проверка работоспособности

После запуска в режиме разработки:

1. Откройте браузер и перейдите на http://localhost:3000
2. Вы должны увидеть главную страницу игры в дартс
3. Проверьте, что все элементы интерфейса загружаются корректно
4. Попробуйте перейти между страницами (если есть роутинг)

## Возможные проблемы и решения

### Проблема: "command not found: node"

**Решение:** Node.js не установлен или не добавлен в PATH. Переустановите Node.js или добавьте его в переменную PATH.

### Проблема: "EACCES: permission denied"

**Решение для Linux/macOS:**

```bash
sudo chown -R $(whoami) ~/.npm
```

### Проблема: "Cannot resolve dependency"

**Решение:**

```bash
# Очистка кэша и переустановка
rm -rf node_modules package-lock.json
npm install
```

### Проблема: Порт 3000 уже занят

**Решение:** Измените порт в `vite.config.ts` или завершите процесс, использующий порт:

```bash
# Найти процесс на порту 3000
lsof -ti:3000

# Завершить процесс (замените PID на реальный)
kill -9 PID
```

### Проблема: Медленная установка зависимостей

**Решение:** Используйте альтернативный пакетный менеджер:

```bash
# Установка pnpm (быстрее npm)
npm install -g pnpm
pnpm install

# Или установка bun (самый быстрый)
curl -fsSL https://bun.sh/install | bash
bun install
```

## Дополнительные команды

```bash
# Проверка кода линтером
npm run lint

# Запуск тестов
npm run test

# Проверка безопасности зависимостей
npm audit

# Обновление зависимостей
npm update
```

## Настройка IDE

### Visual Studio Code

Рекомендуемые расширения:

- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Prettier - Code formatter
- ESLint
- Auto Rename Tag

### WebStorm/IntelliJ IDEA

- Включите поддержку TypeScript
- Настройте ESLint
- Включите поддержку React JSX

## Следующие шаги

После успешной установки:

1. Ознакомьтесь с [README.md](./README.md) для понимания функциональности
2. Изучите структуру проекта в папке `src/`
3. Прочитайте [DEVELOPMENT.md](./DEVELOPMENT.md) для настройки среды разработки
4. Ознакомьтесь с [DEPLOYMENT.md](./DEPLOYMENT.md) для развертывания в продакшене

## Поддержка

Если у вас возникли проблемы с установкой:

1. Проверьте раздел "Возможные проблемы и решения" выше
2. Создайте issue в репозитории проекта
3. Убедитесь, что ваша система соответствует системным требованиям
