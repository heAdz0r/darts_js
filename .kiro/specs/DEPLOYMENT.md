# 🚀 Руководство по развертыванию

Это руководство описывает различные способы развертывания приложения Darts Game в продакшене.

## Подготовка к развертыванию

### Предварительные проверки

Перед развертыванием убедитесь, что:

```bash
# Проект собирается без ошибок
npm run build

# Все тесты проходят
npm run test

# Нет ошибок линтера
npm run lint

# Предварительный просмотр работает
npm run preview
```

### Оптимизация для продакшена

#### 1. Переменные окружения

Создайте файл `.env.production`:

```bash
# .env.production
VITE_APP_TITLE="Darts Game"
VITE_API_URL=https://your-api-domain.com
VITE_ANALYTICS_ID=your-analytics-id
```

#### 2. Оптимизация сборки

Убедитесь, что в `vite.config.ts` настроена оптимизация:

```typescript
export default defineConfig({
  build: {
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
        },
      },
    },
  },
});
```

## Статическое развертывание

### Netlify (рекомендуется для SPA)

#### Автоматическое развертывание через Git

1. **Подключите репозиторий:**

   - Зайдите на [netlify.com](https://netlify.com)
   - Нажмите "New site from Git"
   - Выберите ваш Git провайдер и репозиторий

2. **Настройте сборку:**

   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Настройте переадресацию для SPA:**

   Создайте файл `public/_redirects`:

   ```
   /*    /index.html   200
   ```

#### Развертывание через CLI

```bash
# Установка Netlify CLI
npm install -g netlify-cli

# Сборка проекта
npm run build

# Развертывание
netlify deploy --prod --dir=dist
```

### Vercel

#### Автоматическое развертывание

1. Установите Vercel CLI:

   ```bash
   npm install -g vercel
   ```

2. Развертывание:

   ```bash
   # Первое развертывание
   vercel

   # Продакшен развертывание
   vercel --prod
   ```

#### Конфигурация

Создайте файл `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### GitHub Pages

#### Настройка GitHub Actions

Создайте файл `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

#### Настройка базового пути

Если развертываете в подпапке, обновите `vite.config.ts`:

```typescript
export default defineConfig({
  base: "/repository-name/",
  // остальная конфигурация
});
```

### Firebase Hosting

#### Установка и настройка

```bash
# Установка Firebase CLI
npm install -g firebase-tools

# Вход в аккаунт
firebase login

# Инициализация проекта
firebase init hosting
```

#### Конфигурация

Файл `firebase.json`:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/static/**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
}
```

#### Развертывание

```bash
# Сборка и развертывание
npm run build
firebase deploy
```

## Серверное развертывание

### Docker

#### Создание Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Конфигурация Nginx

Создайте файл `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Gzip compression
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location /assets/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

#### Сборка и запуск

```bash
# Сборка образа
docker build -t darts-game .

# Запуск контейнера
docker run -p 80:80 darts-game
```

### Docker Compose

Создайте файл `docker-compose.yml`:

```yaml
version: "3.8"

services:
  darts-game:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

Запуск:

```bash
docker-compose up -d
```

### VPS/Dedicated Server

#### Установка на Ubuntu/Debian

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установка Nginx
sudo apt install nginx -y

# Клонирование проекта
git clone <your-repo-url> /var/www/darts-game
cd /var/www/darts-game

# Установка зависимостей и сборка
npm install
npm run build

# Копирование файлов в Nginx
sudo cp -r dist/* /var/www/html/

# Настройка Nginx
sudo nano /etc/nginx/sites-available/darts-game
```

#### Конфигурация Nginx для VPS

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Активация конфигурации:

```bash
sudo ln -s /etc/nginx/sites-available/darts-game /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## SSL/HTTPS настройка

### Let's Encrypt (бесплатный SSL)

```bash
# Установка Certbot
sudo apt install certbot python3-certbot-nginx -y

# Получение сертификата
sudo certbot --nginx -d your-domain.com

# Автоматическое обновление
sudo crontab -e
# Добавьте строку:
0 12 * * * /usr/bin/certbot renew --quiet
```

## Мониторинг и аналитика

### Google Analytics

Добавьте в `index.html`:

```html
<!-- Google Analytics -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "GA_TRACKING_ID");
</script>
```

### Uptime мониторинг

Рекомендуемые сервисы:

- [UptimeRobot](https://uptimerobot.com/) (бесплатный)
- [Pingdom](https://www.pingdom.com/)
- [StatusCake](https://www.statuscake.com/)

## Оптимизация производительности

### Кэширование

#### Service Worker

Создайте файл `public/sw.js`:

```javascript
const CACHE_NAME = "darts-game-v1";
const urlsToCache = ["/", "/static/js/bundle.js", "/static/css/main.css"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

#### CDN

Рекомендуемые CDN провайдеры:

- Cloudflare (бесплатный план)
- AWS CloudFront
- Google Cloud CDN

### Оптимизация изображений

```bash
# Установка инструментов оптимизации
npm install -D vite-plugin-imagemin

# Добавление в vite.config.ts
import { defineConfig } from 'vite'
import { ViteImageOptimize } from 'vite-plugin-imagemin'

export default defineConfig({
  plugins: [
    ViteImageOptimize({
      gifsicle: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.65, 0.8] }
    })
  ]
})
```

## Резервное копирование

### Автоматическое резервное копирование

Создайте скрипт `backup.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/darts-game"
SOURCE_DIR="/var/www/darts-game"

mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz $SOURCE_DIR

# Удаление старых бэкапов (старше 30 дней)
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +30 -delete
```

Добавьте в crontab:

```bash
# Ежедневное резервное копирование в 2:00
0 2 * * * /path/to/backup.sh
```

## Безопасность

### Заголовки безопасности

Добавьте в конфигурацию Nginx:

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

### Обновления безопасности

```bash
# Проверка уязвимостей
npm audit

# Автоматическое исправление
npm audit fix

# Обновление зависимостей
npm update
```

## Решение проблем

### Частые проблемы развертывания

**Проблема**: 404 ошибки при обновлении страницы
**Решение**: Настройте переадресацию на index.html для SPA

**Проблема**: Медленная загрузка
**Решение**: Включите gzip сжатие и настройте кэширование

**Проблема**: Ошибки CORS
**Решение**: Настройте правильные заголовки CORS на сервере

### Логи и отладка

```bash
# Просмотр логов Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Проверка статуса сервисов
sudo systemctl status nginx
sudo systemctl status docker
```

## Чек-лист развертывания

- [ ] Проект собирается без ошибок
- [ ] Все тесты проходят
- [ ] Настроены переменные окружения
- [ ] Настроена переадресация для SPA
- [ ] Включено gzip сжатие
- [ ] Настроено кэширование статических файлов
- [ ] Установлен SSL сертификат
- [ ] Настроен мониторинг
- [ ] Настроено резервное копирование
- [ ] Проверены заголовки безопасности
- [ ] Протестирована работа в продакшене

Следуя этому руководству, вы сможете успешно развернуть приложение Darts Game в любой среде.
