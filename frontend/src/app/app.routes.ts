import { Routes } from '@angular/router';

/**
 * Конфігурація маршрутів додатку
 * Використовує lazy loading для оптимізації завантаження
 */
export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'dashboard', 
    pathMatch: 'full' 
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
    title: 'Головна — Angular Learning Hub'
  },
  {
    path: 'lessons',
    loadComponent: () => import('./features/lessons/lesson-list/lesson-list.component')
      .then(m => m.LessonListComponent),
    title: 'Уроки — Angular Learning Hub'
  },
  {
    path: 'lessons/:id',
    loadComponent: () => import('./features/lessons/lesson-detail/lesson-detail.component')
      .then(m => m.LessonDetailComponent),
    title: 'Урок — Angular Learning Hub'
  },
  {
    path: 'quiz/:id',
    loadComponent: () => import('./features/quiz/quiz.component')
      .then(m => m.QuizComponent),
    title: 'Тест — Angular Learning Hub'
  },
  {
    path: 'progress',
    loadComponent: () => import('./features/progress/progress.component')
      .then(m => m.ProgressComponent),
    title: 'Прогрес — Angular Learning Hub'
  },
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found.component')
      .then(m => m.NotFoundComponent),
    title: '404 — Сторінку не знайдено'
  }
];
