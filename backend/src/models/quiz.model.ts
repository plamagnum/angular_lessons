/**
 * Модель тесту для перевірки знань
 */

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  questions: QuizQuestion[];
}

/**
 * Питання в тесті
 */
export interface QuizQuestion {
  id: string;
  text: string;
  type: 'single' | 'multiple' | 'code';
  options?: QuizOption[];
  correctAnswer?: string;
  explanation: string;
  points: number;
}

/**
 * Варіант відповіді
 */
export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}
