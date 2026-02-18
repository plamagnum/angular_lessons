import { Router } from 'express';
import * as quizController from '../controllers/quiz.controller';

/**
 * Маршрути для тестів
 */
const router = Router();

// GET /api/quizzes - отримати всі тести
router.get('/', quizController.getAll);

// GET /api/quizzes/:id - отримати тест за ID
router.get('/:id', quizController.getById);

// POST /api/quizzes/:id/check - перевірити відповіді
router.post('/:id/check', quizController.checkAnswers);

// GET /api/quizzes/lesson/:lessonId - отримати інфо про тест за ID уроку
router.get('/lesson/:lessonId', quizController.getByLessonId);

export { router as quizRoutes };
