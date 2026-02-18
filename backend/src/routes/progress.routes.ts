import { Router } from 'express';
import * as progressController from '../controllers/progress.controller';

/**
 * Маршрути для прогресу користувача
 */
const router = Router();

// GET /api/progress - отримати прогрес користувача
router.get('/', progressController.get);

// POST /api/progress/lesson - позначити урок як завершений
router.post('/lesson', progressController.completeLesson);

// POST /api/progress/task - позначити завдання як завершене
router.post('/task', progressController.completeTask);

// POST /api/progress/quiz - зберегти результат тесту
router.post('/quiz', progressController.saveQuizResult);

export { router as progressRoutes };
