/**
 * Модель прогресу користувача
 */

export interface UserProgress {
  userId: string;
  lessonProgress: LessonProgress[];
  quizResults: QuizResult[];
  totalPoints: number;
  streak: number;
  lastActivity: string;
}

/**
 * Прогрес по окремому уроку
 */
export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  completedAt?: string;
  completedTasks: string[];
}

/**
 * Результат проходження тесту
 */
export interface QuizResult {
  quizId: string;
  score: number;
  maxScore: number;
  completedAt: string;
  answers: Record<string, string[]>;
}
