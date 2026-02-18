import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { environment } from '@env/environment';

/**
 * Інтерфейси для уроків (відповідають backend моделям)
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

export type LessonCategory =
  | 'basics' | 'components' | 'directives' | 'services'
  | 'routing' | 'forms' | 'rxjs' | 'state' | 'testing' | 'advanced';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface LearningTask {
  id: string;
  title: string;
  description: string;
  hint?: string;
  solution?: string;
}

/**
 * Параметри для фільтрації уроків
 */
export interface LessonFilters {
  category?: LessonCategory;
  difficulty?: Difficulty;
  search?: string;
}

/**
 * Сервіс для роботи з уроками
 */
@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/lessons`;
  
  // Кешований запит для всіх уроків
  private allLessons$?: Observable<Lesson[]>;
  
  /**
   * Отримати список уроків з фільтрацією
   */
  getLessons(filters?: LessonFilters): Observable<Lesson[]> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.category) {
        params = params.set('category', filters.category);
      }
      if (filters.difficulty) {
        params = params.set('difficulty', filters.difficulty);
      }
      if (filters.search) {
        params = params.set('search', filters.search);
      }
    }
    
    return this.http.get<Lesson[]>(this.apiUrl, { params });
  }
  
  /**
   * Отримати урок за ID
   */
  getLesson(id: string): Observable<Lesson> {
    return this.http.get<Lesson>(`${this.apiUrl}/${id}`);
  }
  
  /**
   * Отримати список категорій
   */
  getCategories(): Observable<LessonCategory[]> {
    return this.http.get<LessonCategory[]>(`${this.apiUrl}/categories`);
  }
  
  /**
   * Отримати всі уроки з кешуванням
   * Використовується для dashboard та інших місць, де потрібен повний список
   */
  getAllCached(): Observable<Lesson[]> {
    if (!this.allLessons$) {
      this.allLessons$ = this.http.get<Lesson[]>(this.apiUrl).pipe(
        shareReplay(1) // Кешувати результат
      );
    }
    return this.allLessons$;
  }
  
  /**
   * Скинути кеш (якщо потрібно оновити дані)
   */
  clearCache(): void {
    this.allLessons$ = undefined;
  }
  
  /**
   * Отримати переклад складності українською
   */
  getDifficultyLabel(difficulty: Difficulty): string {
    const labels: Record<Difficulty, string> = {
      beginner: 'Початковий',
      intermediate: 'Середній',
      advanced: 'Просунутий'
    };
    return labels[difficulty];
  }
  
  /**
   * Отримати переклад категорії українською
   */
  getCategoryLabel(category: LessonCategory): string {
    const labels: Record<LessonCategory, string> = {
      basics: 'Основи',
      components: 'Компоненти',
      directives: 'Директиви',
      services: 'Сервіси',
      routing: 'Маршрутизація',
      forms: 'Форми',
      rxjs: 'RxJS',
      state: 'Стан',
      testing: 'Тестування',
      advanced: 'Просунуті теми'
    };
    return labels[category];
  }
}
