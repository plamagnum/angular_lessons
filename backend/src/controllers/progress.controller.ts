import { Request, Response } from 'express';
import { UserProgress, LessonProgress, QuizResult } from '../models/progress.model';

/**
 * Контролер для управління прогресом користувача
 * В реальному додатку дані зберігалися б у базі даних
 * Тут використовуємо in-memory storage для демонстрації
 */

// Тимчасове сховище для прогресу
const userProgressStore: Map<string, UserProgress> = new Map();

// ID користувача за замовчуванням (в реальному додатку з автентифікації)
const DEFAULT_USER_ID = 'user-1';

/**
 * Отримати або створити прогрес користувача
 */
const getOrCreateProgress = (userId: string = DEFAULT_USER_ID): UserProgress => {
  if (!userProgressStore.has(userId)) {
    userProgressStore.set(userId, {
      userId,
      lessonProgress: [],
      quizResults: [],
      totalPoints: 0,
      streak: 0,
      lastActivity: new Date().toISOString()
    });
  }
  return userProgressStore.get(userId)!;
};

/**
 * Отримати прогрес користувача
 */
export const get = (_req: Request, res: Response) => {
  try {
    const progress = getOrCreateProgress();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Помилка отримання прогресу' });
  }
};

/**
 * Позначити урок як завершений
 * Body: { lessonId: string }
 */
export const completeLesson = (req: Request, res: Response) => {
  try {
    const { lessonId } = req.body;
    
    if (!lessonId) {
      return res.status(400).json({ error: 'lessonId обов\'язковий' });
    }
    
    const progress = getOrCreateProgress();
    
    // Знайти або створити прогрес уроку
    let lessonProgress = progress.lessonProgress.find(lp => lp.lessonId === lessonId);
    
    if (!lessonProgress) {
      lessonProgress = {
        lessonId,
        completed: true,
        completedAt: new Date().toISOString(),
        completedTasks: []
      };
      progress.lessonProgress.push(lessonProgress);
    } else {
      lessonProgress.completed = true;
      lessonProgress.completedAt = new Date().toISOString();
    }
    
    progress.lastActivity = new Date().toISOString();
    
    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ error: 'Помилка збереження прогресу' });
  }
};

/**
 * Позначити завдання як завершене
 * Body: { lessonId: string, taskId: string }
 */
export const completeTask = (req: Request, res: Response) => {
  try {
    const { lessonId, taskId } = req.body;
    
    if (!lessonId || !taskId) {
      return res.status(400).json({ error: 'lessonId та taskId обов\'язкові' });
    }
    
    const progress = getOrCreateProgress();
    
    // Знайти або створити прогрес уроку
    let lessonProgress = progress.lessonProgress.find(lp => lp.lessonId === lessonId);
    
    if (!lessonProgress) {
      lessonProgress = {
        lessonId,
        completed: false,
        completedTasks: [taskId]
      };
      progress.lessonProgress.push(lessonProgress);
    } else {
      if (!lessonProgress.completedTasks.includes(taskId)) {
        lessonProgress.completedTasks.push(taskId);
      }
    }
    
    progress.lastActivity = new Date().toISOString();
    
    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ error: 'Помилка збереження прогресу завдання' });
  }
};

/**
 * Зберегти результат тесту
 * Body: { quizId: string, score: number, maxScore: number, answers: Record<string, string[]> }
 */
export const saveQuizResult = (req: Request, res: Response) => {
  try {
    const { quizId, score, maxScore, answers } = req.body;
    
    if (!quizId || score === undefined || !maxScore || !answers) {
      return res.status(400).json({ 
        error: 'quizId, score, maxScore та answers обов\'язкові' 
      });
    }
    
    const progress = getOrCreateProgress();
    
    const quizResult: QuizResult = {
      quizId,
      score,
      maxScore,
      completedAt: new Date().toISOString(),
      answers
    };
    
    // Видалити попередній результат для цього тесту
    progress.quizResults = progress.quizResults.filter(qr => qr.quizId !== quizId);
    progress.quizResults.push(quizResult);
    
    // Оновити загальні бали
    progress.totalPoints = progress.quizResults.reduce((sum, qr) => sum + qr.score, 0);
    progress.lastActivity = new Date().toISOString();
    
    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ error: 'Помилка збереження результату тесту' });
  }
};
