/**
 * Модель уроку для додатку вивчення Angular
 */

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  category: LessonCategory;
  difficulty: Difficulty;
  order: number;
  estimatedMinutes: number;
  tags: string[];
  codeExample?: string;
  tasks: LearningTask[];
}

/**
 * Категорії уроків
 */
export type LessonCategory =
  | 'basics' | 'components' | 'directives' | 'services'
  | 'routing' | 'forms' | 'rxjs' | 'state' | 'testing' | 'advanced';

/**
 * Рівні складності
 */
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

/**
 * Практичне завдання в уроці
 */
export interface LearningTask {
  id: string;
  title: string;
  description: string;
  hint?: string;
  solution?: string;
}
