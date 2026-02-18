import { Request, Response } from 'express';
import { lessonsData } from '../data/lessons.data';
import { Lesson, LessonCategory, Difficulty } from '../models/lesson.model';

/**
 * Контролер для управління уроками
 */

/**
 * Отримати всі уроки з можливістю фільтрації
 */
export const getAll = (req: Request, res: Response) => {
  try {
    let filteredLessons: Lesson[] = [...lessonsData];
    
    // Фільтр по категорії
    const category = req.query.category as LessonCategory | undefined;
    if (category) {
      filteredLessons = filteredLessons.filter(lesson => lesson.category === category);
    }
    
    // Фільтр по складності
    const difficulty = req.query.difficulty as Difficulty | undefined;
    if (difficulty) {
      filteredLessons = filteredLessons.filter(lesson => lesson.difficulty === difficulty);
    }
    
    // Пошук по назві або опису
    const search = req.query.search as string | undefined;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredLessons = filteredLessons.filter(lesson => 
        lesson.title.toLowerCase().includes(searchLower) ||
        lesson.description.toLowerCase().includes(searchLower) ||
        lesson.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    res.json(filteredLessons);
  } catch (error) {
    res.status(500).json({ error: 'Помилка отримання уроків' });
  }
};

/**
 * Отримати урок за ID
 */
export const getById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lesson = lessonsData.find(l => l.id === id);
    
    if (!lesson) {
      return res.status(404).json({ error: 'Урок не знайдено' });
    }
    
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Помилка отримання уроку' });
  }
};

/**
 * Отримати список всіх категорій
 */
export const getCategories = (_req: Request, res: Response) => {
  try {
    const categories = Array.from(
      new Set(lessonsData.map(lesson => lesson.category))
    );
    
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Помилка отримання категорій' });
  }
};
