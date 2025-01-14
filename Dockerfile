# Этап сборки
FROM node:20-alpine as builder

WORKDIR /app

# Копируем файлы для установки зависимостей
COPY package*.json ./
COPY tsconfig.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код
COPY . .

# Собираем проект
RUN npm run build

# Этап для тестирования
FROM node:20-alpine as tester

WORKDIR /app

# Копируем собранный пакет и зависимости
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/plop-templates ./plop-templates
COPY --from=builder /app/package*.json ./

# Устанавливаем только production зависимости
RUN npm ci --only=production

# Создаем тестовый проект
RUN mkdir -p /test-project && \
    cd /test-project && \
    npm init -y && \
    npm install /app

# Добавляем plopfile.js в тестовый проект
COPY plopfile.mjs /test-project/

# Рабочая директория для тестирования
WORKDIR /test-project

# Команда по умолчанию - запуск генератора
CMD ["npx", "plop", "component"] 