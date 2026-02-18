import express from 'express';
import cors from 'cors';
import { lessonRoutes } from './routes/lesson.routes';
import { quizRoutes } from './routes/quiz.routes';
import { progressRoutes } from './routes/progress.routes';

/**
 * Express сервер для Angular Learning Hub API
 */

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Дозволити CORS для всіх запитів
app.use(express.json()); // Парсинг JSON body

// Логування запитів
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/lessons', lessonRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/progress', progressRoutes);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Маршрут не знайдено' });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Помилка сервера:', err);
  res.status(500).json({ error: 'Внутрішня помилка сервера' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущено на порту ${PORT}`);
  console.log(`📚 API доступний за адресою http://localhost:${PORT}/api`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
});

export default app;
