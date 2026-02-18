import { Router } from 'express';
import * as lessonController from '../controllers/lesson.controller';

/**
 * Маршрути для уроків
 */
const router = Router();

// GET /api/lessons - отримати всі уроки (з фільтрацією)
router.get('/', lessonController.getAll);

// GET /api/lessons/categories - отримати список категорій
router.get('/categories', lessonController.getCategories);

// GET /api/lessons/:id - отримати урок за ID
router.get('/:id', lessonController.getById);

export { router as lessonRoutes };
