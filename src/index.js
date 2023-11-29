import "@/styles/global.scss"
import { Router } from "./core/router/router"

new Router()

// настройка .env
// NODE_ENV=development
// JWT_SECRET=eregrw9345:ser
// DATABASE_URL="postgresql://postgres:123456@localhost:5432/bank-app-red-project?schema=public"
// PORT=4200

// [x] - Установка PostgreSQL
// [x] - Установка Insomnia + TablePlus
// [x] - Меняем .env на postgresql://postgres:123456@localhost:5432/bank-app-js-intensive?schema=public
// [x] - Установить зависимости
// [x] - npx prisma db push (в папке бэкенда)
// [x] - Запуск back-end
  // yarn start:dev - команда для запуска бэкенда 
// [x] - Импорт схемы в Insomnia
// [x] - Тестирование в программах