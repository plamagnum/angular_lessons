FROM node:20-alpine AS builder

WORKDIR /app

# Копіювати package файли
COPY package*.json ./

# Встановити залежності
RUN npm ci

# Копіювати вихідний код
COPY . .

# Збудувати додаток
RUN npm run build

# Production stage з Nginx
FROM nginx:alpine

# Копіювати збудований додаток
COPY --from=builder /app/dist/angular-learning-hub /usr/share/nginx/html

# Копіювати конфігурацію Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Відкрити порт
EXPOSE 80

# Запустити Nginx
CMD ["nginx", "-g", "daemon off;"]
