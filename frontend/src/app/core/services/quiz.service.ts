import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

/**
 * Інтерфейси для тестів (відповідають backend моделям)
 */
export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  text: string;
  type: 'single' | 'multiple' | 'code';
  options?: QuizOption[];
  correctAnswer?: string;
  explanation: string;
  points: number;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

/**
 * Інформація про тест для уроку
 */
export interface QuizInfo {
  id: string;
  lessonId: string;
  title: string;
  questionCount: number;
  totalPoints: number;
}

/**
 * Результат перевірки тесту
 */
export interface QuizCheckResult {
  score: number;
  maxScore: number;
  percentage: number;
  results: QuizQuestionResult[];
}

export interface QuizQuestionResult {
  questionId: string;
  correct: boolean;
  userAnswers: string[];
  correctAnswers: string[];
  explanation: string;
  points: number;
  earnedPoints: number;
}

/**
 * Сервіс для роботи з тестами
 */
@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/quizzes`;
  
  /**
   * Отримати тест за ID
   */
  getQuiz(id: string): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}/${id}`);
  }
  
  /**
   * Отримати інформацію про тест за ID уроку
   */
  getQuizByLesson(lessonId: string): Observable<QuizInfo> {
    return this.http.get<QuizInfo>(`${this.apiUrl}/lesson/${lessonId}`);
  }
  
  /**
   * Перевірити відповіді користувача
   * @param quizId - ID тесту
   * @param answers - Об'єкт з відповідями { questionId: ['optionId'] }
   */
  checkAnswers(quizId: string, answers: Record<string, string[]>): Observable<QuizCheckResult> {
    return this.http.post<QuizCheckResult>(`${this.apiUrl}/${quizId}/check`, { answers });
  }
  
  /**
   * Отримати список всіх тестів
   */
  getAllQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(this.apiUrl);
  }
  
  /**
   * Перевірити чи є тест для уроку
   */
  hasQuizForLesson(lessonId: string): Observable<boolean> {
    return new Observable(observer => {
      this.getQuizByLesson(lessonId).subscribe({
        next: () => {
          observer.next(true);
          observer.complete();
        },
        error: () => {
          observer.next(false);
          observer.complete();
        }
      });
    });
  }
}
