# 🅰️ Angular Learning Hub

![Angular](https://img.shields.io/badge/Angular-17.2-DD0031?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)

Повнофункціональний веб-додаток для інтерактивного вивчення Angular з уроками, тестами та відстеженням прогресу.

## 📋 Зміст

- [Опис](#-опис)
- [Технології](#-технології)
- [Швидкий старт](#-швидкий-старт)
- [Розробка](#-розробка)
- [Структура проєкту](#-структура-проєкту)
- [Уроки](#-уроки)
- [Функціонал](#-функціонал)
- [Як розширити](#-як-розширити)
- [Теми](#-теми)

## 📖 Опис

Angular Learning Hub — це інтерактивна платформа для вивчення Angular 17+, яка включає:

- 📚 **7 детальних уроків** — від основ до просунутих тем
- 📝 **3 інтерактивні тести** — перевірка знань з балами
- ✅ **Практичні завдання** — з підказками та рішеннями
- 📊 **Відстеження прогресу** — візуалізація досягнень
- 🌓 **Світла/темна тема** — комфортне навчання в будь-який час
- 📱 **Адаптивний дизайн** — працює на всіх пристроях

## 🛠 Технології

### Frontend
- **Angular 17.2** — Standalone компоненти, Signals, новий Control Flow
- **TypeScript 5.3** — Strict mode, типізація
- **RxJS 7.8** — Реактивне програмування
- **SCSS** — CSS Custom Properties для тем

### Backend
- **Node.js 20** — JavaScript runtime
- **Express 4.18** — Web framework
- **TypeScript 5.3** — Типізація на backend
- **CORS** — Cross-origin запити

### Інфраструктура
- **Docker** — Контейнеризація
- **Docker Compose** — Оркестрація сервісів
- **Nginx** — Reverse proxy для frontend

## 🚀 Швидкий старт

### Через Docker Compose (рекомендовано)

```bash
# Клонувати репозиторій
git clone https://github.com/plamagnum/angular_lessons.git
cd angular_lessons

# Запустити додаток
docker compose up --build

# Відкрити в браузері
open http://localhost:8080
```

Додаток буде доступний за адресою:
- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:3000

Для зупинки:
```bash
docker compose down
```

## 💻 Розробка

### Backend

```bash
cd backend

# Встановити залежності
npm install

# Запустити в режимі розробки
npm run dev

# Збудувати
npm run build

# Запустити production версію
npm start
```

API буде доступний на http://localhost:3000

### Frontend

```bash
cd frontend

# Встановити залежності
npm install

# Запустити dev сервер
npm start

# Збудувати для production
npm run build
```

Додаток буде доступний на http://localhost:4200

**Примітка:** Для роботи з API потрібен запущений backend на порту 3000.

## 📁 Структура проєкту

```
angular-learning-hub/
├── backend/                      # Node.js + Express API
│   ├── src/
│   │   ├── models/              # TypeScript моделі даних
│   │   │   ├── lesson.model.ts
│   │   │   ├── quiz.model.ts
│   │   │   └── progress.model.ts
│   │   ├── data/                # Дані уроків та тестів
│   │   │   ├── lessons.data.ts  # 7 уроків
│   │   │   └── quizzes.data.ts  # 3 тести
│   │   ├── controllers/         # Бізнес-логіка
│   │   │   ├── lesson.controller.ts
│   │   │   ├── quiz.controller.ts
│   │   │   └── progress.controller.ts
│   │   ├── routes/              # Express маршрути
│   │   │   ├── lesson.routes.ts
│   │   │   ├── quiz.routes.ts
│   │   │   └── progress.routes.ts
│   │   └── server.ts            # Головний файл сервера
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── frontend/                     # Angular 17+ додаток
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   └── services/    # Основні сервіси
│   │   │   │       ├── theme.service.ts
│   │   │   │       ├── lesson.service.ts
│   │   │   │       ├── quiz.service.ts
│   │   │   │       └── progress.service.ts
│   │   │   ├── shared/
│   │   │   │   └── components/
│   │   │   │       └── not-found/
│   │   │   ├── features/        # Feature компоненти
│   │   │   │   ├── dashboard/
│   │   │   │   ├── lessons/
│   │   │   │   │   ├── lesson-list/
│   │   │   │   │   └── lesson-detail/
│   │   │   │   ├── quiz/
│   │   │   │   └── progress/
│   │   │   ├── layout/          # Layout компоненти
│   │   │   │   └── header/
│   │   │   ├── app.component.ts
│   │   │   ├── app.config.ts    # Конфігурація додатку
│   │   │   └── app.routes.ts    # Маршрути
│   │   ├── environments/        # Environment конфігурація
│   │   ├── styles/
│   │   │   └── styles.scss      # Глобальні стилі
│   │   ├── index.html
│   │   └── main.ts
│   ├── angular.json
│   ├── tsconfig.json
│   ├── proxy.conf.json          # Proxy для API
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml            # Docker Compose конфігурація
└── README.md
```

## 📚 Уроки

| # | Урок | Складність | Час | Теми |
|---|------|------------|-----|------|
| 1 | Що таке Angular? | Початковий | 15 хв | SPA, архітектура, standalone компоненти |
| 2 | Компоненти та шаблони | Початковий | 25 хв | @Input, @Output, lifecycle hooks, data binding |
| 3 | Директиви та Pipes | Початковий | 20 хв | @if, @for, @switch, custom pipes |
| 4 | Сервіси та DI | Середній | 30 хв | @Injectable, inject(), HttpClient, BehaviorSubject |
| 5 | Маршрутизація | Середній | 30 хв | Routes, lazy loading, guards, resolvers |
| 6 | Реактивні форми | Середній | 35 хв | FormGroup, FormControl, Validators, typed forms |
| 7 | Signals та реактивність | Середній | 25 хв | signal(), computed(), effect() |

**Загалом:** 180 хвилин навчального матеріалу + 14 практичних завдань + 3 тести

## ✨ Функціонал

### Для користувачів

- **Dashboard:** Огляд прогресу, статистика, список уроків
- **Уроки:** Детальний контент з прикладами коду
- **Практичні завдання:** З підказками та готовими рішеннями
- **Інтерактивні тести:** Перевірка знань з миттєвим результатом
- **Відстеження прогресу:** Завершені уроки, завдання, тести
- **Система балів:** Мотивація через ігрофікацію
- **Темна/світла тема:** Автоматичне збереження налаштувань

### Технічні особливості

- **Standalone компоненти** — без NgModule
- **Signals API** — реактивність нового покоління
- **Новий Control Flow** — @if, @for, @switch
- **Lazy Loading** — оптимізація завантаження
- **inject()** — functional DI API
- **withComponentInputBinding** — @Input від Router
- **shareReplay** — кешування HTTP запитів
- **Mobile-first** — адаптивний дизайн

## 🔧 Як розширити

### Додати новий урок

1. Відкрийте `backend/src/data/lessons.data.ts`
2. Додайте новий об'єкт `Lesson` до масиву:

```typescript
{
  id: 'lesson-8',
  title: 'Ваш новий урок',
  description: 'Опис уроку',
  content: `<h2>HTML контент</h2><p>...</p>`,
  category: 'advanced',
  difficulty: 'advanced',
  order: 8,
  estimatedMinutes: 30,
  tags: ['теги'],
  codeExample: 'код приклад',
  tasks: [
    {
      id: 'task-8-1',
      title: 'Завдання',
      description: 'Опис',
      hint: 'Підказка',
      solution: 'Рішення'
    }
  ]
}
```

3. Перезапустіть backend

### Додати новий тест

1. Відкрийте `backend/src/data/quizzes.data.ts`
2. Додайте новий об'єкт `Quiz`:

```typescript
{
  id: 'quiz-4',
  lessonId: 'lesson-8',
  title: 'Тест до уроку 8',
  questions: [
    {
      id: 'q4-1',
      text: 'Питання?',
      type: 'single',
      options: [
        { id: 'a', text: 'Варіант A', isCorrect: false },
        { id: 'b', text: 'Варіант B', isCorrect: true }
      ],
      explanation: 'Пояснення',
      points: 10
    }
  ]
}
```

### Додати нову сторінку

1. Створіть компонент у `frontend/src/app/features/`
2. Додайте маршрут у `app.routes.ts`:

```typescript
{
  path: 'new-page',
  loadComponent: () => import('./features/new-page/new-page.component')
    .then(m => m.NewPageComponent),
  title: 'Нова сторінка'
}
```

3. Додайте посилання в Header

## 🌓 Теми

Додаток підтримує світлу та темну теми з автоматичним збереженням налаштувань.

### Як працюють теми

1. **CSS Custom Properties** — всі кольори визначені через змінні
2. **ThemeService** — Angular сервіс з Signals API
3. **localStorage** — збереження вибору користувача
4. **prefers-color-scheme** — автоматичне визначення системної теми

### Кастомізація теми

Відредагуйте `frontend/src/styles/styles.scss`:

```scss
:root {
  --color-primary: #dd0031;  // Ваш колір
  // ... інші змінні
}

[data-theme='dark'] {
  --color-bg: #1a1a1a;       // Темна тема
  // ... інші змінні
}
```

## 🤝 Внесок

Вітаються pull requests! Для великих змін спочатку відкрийте issue для обговорення.

## 📄 Ліцензія

MIT

## 👨‍💻 Автор

Створено для вивчення Angular 17+ з використанням сучасних практик та патернів.

---

**Приємного навчання! 🅰️✨**
