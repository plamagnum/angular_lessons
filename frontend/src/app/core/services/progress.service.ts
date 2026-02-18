import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '@env/environment';

/**
 * Інтерфейси для прогресу (відповідають backend моделям)
 */
export interface UserProgress {
  userId: string;
  lessonProgress: LessonProgress[];
  quizResults: QuizResult[];
  totalPoints: number;
  streak: number;
  lastActivity: string;
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  completedAt?: string;
  completedTasks: string[];
}

export interface QuizResult {
  quizId: string;
  score: number;
  maxScore: number;
  completedAt: string;
  answers: Record<string, string[]>;
}

/**
 * Сервіс для управління прогресом користувача
 * Використовує Signals для реактивного стану
 */
@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/progress`;
  
  // Signal для зберігання прогресу
  private progressSignal = signal<UserProgress>({
    userId: 'user-1',
    lessonProgress: [],
    quizResults: [],
    totalPoints: 0,
    streak: 0,
    lastActivity: new Date().toISOString()
  });
  
  // Публічний доступ до прогресу (readonly)
  progress = this.progressSignal.asReadonly();
  
  // Computed signals для зручного доступу до статистики
  completedLessonsCount = computed(() => 
    this.progressSignal().lessonProgress.filter(lp => lp.completed).length
  );
  
  totalPoints = computed(() => this.progressSignal().totalPoints);
  
  completedTasksCount = computed(() => 
    this.progressSignal().lessonProgress.reduce(
      (sum, lp) => sum + lp.completedTasks.length, 
      0
    )
  );
  
  completedQuizzesCount = computed(() => 
    this.progressSignal().quizResults.length
  );
  
  /**
   * Завантажити прогрес з сервера
   */
  loadProgress(): Observable<UserProgress> {
    return this.http.get<UserProgress>(this.apiUrl).pipe(
      tap(progress => this.progressSignal.set(progress))
    );
  }
  
  /**
   * Позначити урок як завершений
   */
  completeLesson(lessonId: string): Observable<{ success: boolean; progress: UserProgress }> {
    return this.http.post<{ success: boolean; progress: UserProgress }>(
      `${this.apiUrl}/lesson`,
      { lessonId }
    ).pipe(
      tap(response => {
        if (response.success) {
          this.progressSignal.set(response.progress);
        }
      })
    );
  }
  
  /**
   * Позначити завдання як завершене
   */
  completeTask(lessonId: string, taskId: string): Observable<{ success: boolean; progress: UserProgress }> {
    return this.http.post<{ success: boolean; progress: UserProgress }>(
      `${this.apiUrl}/task`,
      { lessonId, taskId }
    ).pipe(
      tap(response => {
        if (response.success) {
          this.progressSignal.set(response.progress);
        }
      })
    );
  }
  
  /**
   * Зберегти результат тесту
   */
  saveQuizResult(
    quizId: string, 
    score: number, 
    maxScore: number, 
    answers: Record<string, string[]>
  ): Observable<{ success: boolean; progress: UserProgress }> {
    return this.http.post<{ success: boolean; progress: UserProgress }>(
      `${this.apiUrl}/quiz`,
      { quizId, score, maxScore, answers }
    ).pipe(
      tap(response => {
        if (response.success) {
          this.progressSignal.set(response.progress);
        }
      })
    );
  }
  
  /**
   * Перевірити чи урок завершено
   */
  isLessonCompleted(lessonId: string): boolean {
    const lessonProgress = this.progressSignal().lessonProgress
      .find(lp => lp.lessonId === lessonId);
    return lessonProgress?.completed || false;
  }
  
  /**
   * Перевірити чи завдання завершено
   */
  isTaskCompleted(lessonId: string, taskId: string): boolean {
    const lessonProgress = this.progressSignal().lessonProgress
      .find(lp => lp.lessonId === lessonId);
    return lessonProgress?.completedTasks.includes(taskId) || false;
  }
  
  /**
   * Отримати прогрес по уроку
   */
  getLessonProgress(lessonId: string): LessonProgress | undefined {
    return this.progressSignal().lessonProgress
      .find(lp => lp.lessonId === lessonId);
  }
  
  /**
   * Отримати результат тесту
   */
  getQuizResult(quizId: string): QuizResult | undefined {
    return this.progressSignal().quizResults
      .find(qr => qr.quizId === quizId);
  }
  
  /**
   * Обчислити відсоток виконаних завдань в уроці
   */
  getLessonTasksCompletion(lessonId: string, totalTasks: number): number {
    const lessonProgress = this.getLessonProgress(lessonId);
    if (!lessonProgress || totalTasks === 0) return 0;
    return Math.round((lessonProgress.completedTasks.length / totalTasks) * 100);
  }
}
