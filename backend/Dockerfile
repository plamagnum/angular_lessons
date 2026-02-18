FROM node:20-alpine AS builder

WORKDIR /app

# Копіювати package файли
COPY package*.json ./

# Встановити залежності
RUN npm ci

# Копіювати вихідний код
COPY . .

# Скомпілювати TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Копіювати package файли
COPY package*.json ./

# Встановити тільки production залежності
RUN npm ci --omit=dev

# Копіювати скомпільований код з builder stage
COPY --from=builder /app/dist ./dist

# Відкрити порт
EXPOSE 3000

# Запустити додаток
CMD ["node", "dist/server.js"]
