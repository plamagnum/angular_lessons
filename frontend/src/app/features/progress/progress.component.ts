import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProgressService } from '@core/services/progress.service';
import { LessonService, Lesson } from '@core/services/lesson.service';

/**
 * Компонент відображення прогресу користувача
 */
@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <h1>Ваш прогрес</h1>
      
      <!-- Загальна статистика -->
      <section class="stats">
        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-content">
            <div class="stat-value">{{ progressService.totalPoints() }}</div>
            <div class="stat-label">Загальні бали</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-content">
            <div class="stat-value">{{ progressService.completedLessonsCount() }}</div>
            <div class="stat-label">Уроків завершено</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <div class="stat-value">{{ progressService.completedTasksCount() }}</div>
            <div class="stat-label">Завдань виконано</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📝</div>
          <div class="stat-content">
            <div class="stat-value">{{ progressService.completedQuizzesCount() }}</div>
            <div class="stat-label">Тестів пройдено</div>
          </div>
        </div>
      </section>
      
      <!-- Загальний прогрес -->
      <section class="overall-progress card">
        <h2>Загальний прогрес</h2>
        <div class="progress-info">
          <span class="progress-percentage">{{ overallProgressPercentage() }}%</span>
          <span class="progress-text">
            {{ progressService.completedLessonsCount() }} з {{ totalLessonsCount() }} уроків
          </span>
        </div>
        <div class="progress-bar">
          <div 
            class="progress-bar-fill" 
            [style.width.%]="overallProgressPercentage()">
          </div>
        </div>
      </section>
      
      <!-- Детальний прогрес по уроках -->
      <section class="lessons-progress">
        <h2>Прогрес по уроках</h2>
        
        @if (loading()) {
          <div class="loading">Завантаження...</div>
        } @else if (error()) {
          <div class="error">{{ error() }}</div>
        } @else {
          <div class="lessons-list">
            @for (lesson of lessons(); track lesson.id) {
              <article class="lesson-progress-card" [class.completed]="isCompleted(lesson.id)">
                <div class="lesson-header">
                  <div class="lesson-info">
                    <div class="lesson-number">{{ lesson.order }}</div>
                    <div>
                      <h3>
                        <a [routerLink]="['/lessons', lesson.id]">{{ lesson.title }}</a>
                      </h3>
                      <div class="lesson-meta">
                        <span class="badge badge-secondary">{{ getCategoryLabel(lesson.category) }}</span>
                        <span class="meta-item">{{ lesson.tasks.length }} завдань</span>
                      </div>
                    </div>
                  </div>
                  
                  @if (isCompleted(lesson.id)) {
                    <div class="completion-badge">✓</div>
                  }
                </div>
                
                <!-- Прогрес по завданням -->
                @if (lesson.tasks.length > 0) {
                  <div class="tasks-progress">
                    <div class="tasks-header">
                      <span>Завдання:</span>
                      <span class="tasks-count">
                        {{ getCompletedTasksCount(lesson.id, lesson.tasks.length) }} / {{ lesson.tasks.length }}
                      </span>
                    </div>
                    
                    <div class="progress-bar">
                      <div 
                        class="progress-bar-fill" 
                        [style.width.%]="getTasksProgress(lesson.id, lesson.tasks.length)">
                      </div>
                    </div>
                    
                    <div class="tasks-list">
                      @for (task of lesson.tasks; track task.id) {
                        <div class="task-item" [class.completed]="isTaskCompleted(lesson.id, task.id)">
                          <span class="task-status">
                            @if (isTaskCompleted(lesson.id, task.id)) {
                              ✅
                            } @else {
                              ⭕
                            }
                          </span>
                          <span class="task-title">{{ task.title }}</span>
                        </div>
                      }
                    </div>
                  </div>
                }
                
                <!-- Дата завершення -->
                @if (isCompleted(lesson.id)) {
                  <div class="completion-date">
                    Завершено: {{ getCompletionDate(lesson.id) }}
                  </div>
                }
                
                <a [routerLink]="['/lessons', lesson.id]" class="btn btn-outline btn-sm">
                  @if (isCompleted(lesson.id)) {
                    Повторити урок
                  } @else {
                    Продовжити →
                  }
                </a>
              </article>
            }
          </div>
        }
      </section>
      
      <!-- Результати тестів -->
      @if (quizResults().length > 0) {
        <section class="quiz-results">
          <h2>Результати тестів</h2>
          <div class="quiz-results-list">
            @for (result of quizResults(); track result.quizId) {
              <div class="quiz-result-card">
                <div class="quiz-result-header">
                  <h3>Тест #{{ result.quizId }}</h3>
                  <div class="quiz-score" [class.pass]="getPercentage(result) >= 70">
                    {{ getPercentage(result) }}%
                  </div>
                </div>
                <div class="quiz-result-info">
                  <span>{{ result.score }} / {{ result.maxScore }} балів</span>
                  <span>{{ formatDate(result.completedAt) }}</span>
                </div>
              </div>
            }
          </div>
        </section>
      }
    </div>
  `,
  styles: [`
    h1 {
      margin-bottom: var(--spacing-xl);
    }
    
    /* Статистика */
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-2xl);
    }
    
    .stat-card {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-lg);
      background-color: var(--color-bg);
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
      box-shadow: 0 2px 4px var(--color-shadow);
    }
    
    .stat-icon {
      font-size: 2.5rem;
    }
    
    .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--color-primary);
    }
    
    .stat-label {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
    }
    
    /* Загальний прогрес */
    .overall-progress {
      margin-bottom: var(--spacing-2xl);
    }
    
    .progress-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-md);
    }
    
    .progress-percentage {
      font-size: 2rem;
      font-weight: 700;
      color: var(--color-primary);
    }
    
    .progress-text {
      color: var(--color-text-secondary);
    }
    
    /* Прогрес по уроках */
    .lessons-progress {
      margin-bottom: var(--spacing-2xl);
    }
    
    .lessons-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }
    
    .lesson-progress-card {
      background-color: var(--color-bg);
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
      padding: var(--spacing-lg);
      box-shadow: 0 2px 4px var(--color-shadow);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }
    
    .lesson-progress-card.completed {
      border-left: 4px solid var(--color-success);
      background: linear-gradient(to right, rgba(76, 175, 80, 0.05), var(--color-bg));
    }
    
    .lesson-header {
      display: flex;
      align-items: start;
      justify-content: space-between;
      gap: var(--spacing-md);
    }
    
    .lesson-info {
      display: flex;
      align-items: start;
      gap: var(--spacing-md);
      flex: 1;
    }
    
    .lesson-number {
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--color-primary);
      color: white;
      border-radius: 50%;
      font-weight: 700;
      flex-shrink: 0;
    }
    
    h3 {
      margin: 0 0 var(--spacing-xs) 0;
      font-size: 1.125rem;
    }
    
    h3 a {
      color: var(--color-text);
      text-decoration: none;
    }
    
    h3 a:hover {
      color: var(--color-primary);
    }
    
    .lesson-meta {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-sm);
    }
    
    .meta-item {
      font-size: 0.875rem;
      color: var(--color-text-muted);
    }
    
    .completion-badge {
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--color-success);
      color: white;
      border-radius: 50%;
      font-weight: bold;
      font-size: 1.25rem;
      flex-shrink: 0;
    }
    
    /* Прогрес по завданням */
    .tasks-progress {
      padding: var(--spacing-md);
      background-color: var(--color-bg-secondary);
      border-radius: var(--border-radius-sm);
    }
    
    .tasks-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--spacing-sm);
      font-weight: 500;
    }
    
    .tasks-count {
      color: var(--color-primary);
    }
    
    .tasks-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
      margin-top: var(--spacing-md);
    }
    
    .task-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-size: 0.875rem;
    }
    
    .task-item.completed {
      color: var(--color-success);
    }
    
    .task-status {
      font-size: 1rem;
    }
    
    .task-title {
      flex: 1;
    }
    
    .completion-date {
      font-size: 0.875rem;
      color: var(--color-text-muted);
    }
    
    /* Результати тестів */
    .quiz-results {
      margin-bottom: var(--spacing-2xl);
    }
    
    .quiz-results-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--spacing-lg);
    }
    
    .quiz-result-card {
      padding: var(--spacing-lg);
      background-color: var(--color-bg);
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
      box-shadow: 0 2px 4px var(--color-shadow);
    }
    
    .quiz-result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-md);
    }
    
    .quiz-result-header h3 {
      margin: 0;
      font-size: 1rem;
    }
    
    .quiz-score {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-danger);
    }
    
    .quiz-score.pass {
      color: var(--color-success);
    }
    
    .quiz-result-info {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
      color: var(--color-text-secondary);
    }
  `]
})
export class ProgressComponent implements OnInit {
  progressService = inject(ProgressService);
  private lessonService = inject(LessonService);
  
  // Signals для стану
  lessons = signal<Lesson[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  
  // Computed signals
  totalLessonsCount = computed(() => this.lessons().length);
  overallProgressPercentage = computed(() => {
    const total = this.totalLessonsCount();
    if (total === 0) return 0;
    return Math.round((this.progressService.completedLessonsCount() / total) * 100);
  });
  
  quizResults = computed(() => this.progressService.progress().quizResults);
  
  ngOnInit(): void {
    this.loadLessons();
  }
  
  /**
   * Завантажити уроки
   */
  private loadLessons(): void {
    this.lessonService.getAllCached().subscribe({
      next: (lessons) => {
        this.lessons.set(lessons);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Помилка завантаження уроків:', err);
        this.error.set('Не вдалося завантажити дані');
        this.loading.set(false);
      }
    });
  }
  
  /**
   * Перевірити чи урок завершено
   */
  isCompleted(lessonId: string): boolean {
    return this.progressService.isLessonCompleted(lessonId);
  }
  
  /**
   * Перевірити чи завдання виконано
   */
  isTaskCompleted(lessonId: string, taskId: string): boolean {
    return this.progressService.isTaskCompleted(lessonId, taskId);
  }
  
  /**
   * Отримати кількість виконаних завдань
   */
  getCompletedTasksCount(lessonId: string, totalTasks: number): number {
    const lessonProgress = this.progressService.getLessonProgress(lessonId);
    return lessonProgress?.completedTasks.length || 0;
  }
  
  /**
   * Отримати прогрес по завданням у відсотках
   */
  getTasksProgress(lessonId: string, totalTasks: number): number {
    return this.progressService.getLessonTasksCompletion(lessonId, totalTasks);
  }
  
  /**
   * Отримати дату завершення уроку
   */
  getCompletionDate(lessonId: string): string {
    const lessonProgress = this.progressService.getLessonProgress(lessonId);
    if (!lessonProgress?.completedAt) return '';
    
    const date = new Date(lessonProgress.completedAt);
    return date.toLocaleDateString('uk-UA', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
  
  /**
   * Отримати переклад категорії
   */
  getCategoryLabel(category: string): string {
    return this.lessonService.getCategoryLabel(category as any);
  }
  
  /**
   * Отримати відсоток за результатом тесту
   */
  getPercentage(result: { score: number; maxScore: number }): number {
    if (result.maxScore === 0) return 0;
    return Math.round((result.score / result.maxScore) * 100);
  }
  
  /**
   * Форматувати дату
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', { 
      month: 'short', 
      day: 'numeric' 
    });
  }
}
