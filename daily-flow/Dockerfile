# 1. Используем официальный образ Node.js для сборки приложения
FROM node:16 AS build

# 2. Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# 3. Копируем package.json и package-lock.json
COPY package*.json ./

# 4. Устанавливаем зависимости
RUN npm install

# 5. Копируем весь проект в контейнер
COPY . .

# 6. Собираем проект Vue
RUN npm run build

# 7. Используем минимальный Nginx образ для сервировки статических файлов
FROM nginx:stable-alpine

# 8. Создаем директорию для логов
RUN mkdir -p /app/logs

# 9. Копируем собранные файлы в директорию Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# 10. Копируем пользовательскую конфигурацию Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# 11. Указываем порт, который будет использоваться
EXPOSE 80

# 12. Стартуем Nginx
CMD ["nginx", "-g", "daemon off;"]
