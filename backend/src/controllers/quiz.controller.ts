import { Request, Response } from 'express';
import { quizzesData } from '../data/quizzes.data';
import { Quiz, QuizQuestion } from '../models/quiz.model';

/**
 * Контролер для управління тестами
 */

/**
 * Видалити правильні відповіді з питань
 * (для відправки клієнту)
 */
const sanitizeQuiz = (quiz: Quiz): Quiz => {
  return {
    ...quiz,
    questions: quiz.questions.map(q => ({
      ...q,
      options: q.options?.map(opt => ({
        id: opt.id,
        text: opt.text,
        isCorrect: false // Приховуємо правильну відповідь
      }))
    }))
  };
};

/**
 * Отримати всі тести (без правильних відповідей)
 */
export const getAll = (_req: Request, res: Response) => {
  try {
    const sanitizedQuizzes = quizzesData.map(sanitizeQuiz);
    res.json(sanitizedQuizzes);
  } catch (error) {
    res.status(500).json({ error: 'Помилка отримання тестів' });
  }
};

/**
 * Отримати тест за ID (без правильних відповідей)
 */
export const getById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const quiz = quizzesData.find(q => q.id === id);
    
    if (!quiz) {
      return res.status(404).json({ error: 'Тест не знайдено' });
    }
    
    res.json(sanitizeQuiz(quiz));
  } catch (error) {
    res.status(500).json({ error: 'Помилка отримання тесту' });
  }
};

/**
 * Отримати інформацію про тест за ID уроку
 */
export const getByLessonId = (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params;
    const quiz = quizzesData.find(q => q.lessonId === lessonId);
    
    if (!quiz) {
      return res.status(404).json({ error: 'Тест для цього уроку не знайдено' });
    }
    
    // Повертаємо тільки базову інформацію
    res.json({
      id: quiz.id,
      lessonId: quiz.lessonId,
      title: quiz.title,
      questionCount: quiz.questions.length,
      totalPoints: quiz.questions.reduce((sum, q) => sum + q.points, 0)
    });
  } catch (error) {
    res.status(500).json({ error: 'Помилка отримання інформації про тест' });
  }
};

/**
 * Перевірити відповіді користувача
 * Body: { answers: { questionId: ['optionId'] } }
 */
export const checkAnswers = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { answers } = req.body as { answers: Record<string, string[]> };
    
    if (!answers) {
      return res.status(400).json({ error: 'Відповіді не надані' });
    }
    
    const quiz = quizzesData.find(q => q.id === id);
    if (!quiz) {
      return res.status(404).json({ error: 'Тест не знайдено' });
    }
    
    let score = 0;
    const maxScore = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const results: Array<{
      questionId: string;
      correct: boolean;
      userAnswers: string[];
      correctAnswers: string[];
      explanation: string;
      points: number;
      earnedPoints: number;
    }> = [];
    
    quiz.questions.forEach(question => {
      const userAnswers = answers[question.id] || [];
      const correctAnswers = question.options
        ?.filter(opt => opt.isCorrect)
        .map(opt => opt.id) || [];
      
      // Перевірка відповіді
      const isCorrect = 
        userAnswers.length === correctAnswers.length &&
        userAnswers.every(ans => correctAnswers.includes(ans));
      
      const earnedPoints = isCorrect ? question.points : 0;
      score += earnedPoints;
      
      results.push({
        questionId: question.id,
        correct: isCorrect,
        userAnswers,
        correctAnswers,
        explanation: question.explanation,
        points: question.points,
        earnedPoints
      });
    });
    
    res.json({
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
      results
    });
  } catch (error) {
    res.status(500).json({ error: 'Помилка перевірки відповідей' });
  }
};
