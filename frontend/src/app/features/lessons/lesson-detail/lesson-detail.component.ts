import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LessonService, Lesson } from '@core/services/lesson.service';
import { ProgressService } from '@core/services/progress.service';
import { QuizService, QuizInfo } from '@core/services/quiz.service';

/**
 * Компонент детального перегляду уроку
 * Використовує @Input() id від Router (withComponentInputBinding)
 */
@Component({
  selector: 'app-lesson-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      @if (loading()) {
        <div class="loading">Завантаження уроку...</div>
      } @else if (error()) {
        <div class="error">{{ error() }}</div>
        <a routerLink="/lessons" class="btn btn-primary">← Назад до уроків</a>
      } @else if (lesson()) {
        <!-- Breadcrumbs -->
        <nav class="breadcrumbs">
          <a routerLink="/lessons">Уроки</a>
          <span>/</span>
          <span>{{ lesson()!.title }}</span>
        </nav>
        
        <!-- Заголовок уроку -->
        <header class="lesson-header">
          <div class="lesson-title-section">
            <div class="lesson-number">{{ lesson()!.order }}</div>
            <div>
              <h1>{{ lesson()!.title }}</h1>
              <p class="lesson-description">{{ lesson()!.description }}</p>
            </div>
          </div>
          
          <div class="lesson-meta">
            <span 
              class="badge" 
              [class.badge-beginner]="lesson()!.difficulty === 'beginner'"
              [class.badge-intermediate]="lesson()!.difficulty === 'intermediate'"
              [class.badge-advanced]="lesson()!.difficulty === 'advanced'">
              {{ getDifficultyLabel(lesson()!.difficulty) }}
            </span>
            <span class="badge badge-secondary">{{ getCategoryLabel(lesson()!.category) }}</span>
            <span class="meta-item">⏱️ {{ lesson()!.estimatedMinutes }} хв</span>
            @if (isLessonCompleted()) {
              <span class="badge badge-success">✓ Завершено</span>
            }
          </div>
          
          <div class="lesson-tags">
            @for (tag of lesson()!.tags; track tag) {
              <span class="tag">{{ tag }}</span>
            }
          </div>
        </header>
        
        <!-- Контент уроку -->
        <section class="lesson-content card">
          <div [innerHTML]="lesson()!.content"></div>
        </section>
        
        <!-- Приклад коду -->
        @if (lesson()!.codeExample) {
          <section class="code-section">
            <h2>💻 Приклад коду</h2>
            <div class="code-block">
              <pre><code>{{ lesson()!.codeExample }}</code></pre>
            </div>
          </section>
        }
        
        <!-- Практичні завдання -->
        @if (lesson()!.tasks.length > 0) {
          <section class="tasks-section">
            <h2>📋 Практичні завдання</h2>
            <p class="tasks-intro">Виконайте ці завдання для закріплення матеріалу:</p>
            
            <div class="tasks-list">
              @for (task of lesson()!.tasks; track task.id; let i = $index) {
                <article class="task-card" [class.completed]="isTaskCompleted(task.id)">
                  <div class="task-header">
                    <h3>
                      <span class="task-number">{{ i + 1 }}</span>
                      {{ task.title }}
                    </h3>
                    @if (isTaskCompleted(task.id)) {
                      <span class="completion-badge">✓</span>
                    }
                  </div>
                  
                  <p class="task-description">{{ task.description }}</p>
                  
                  @if (task.hint) {
                    <details class="task-hint">
                      <summary>💡 Підказка</summary>
                      <p>{{ task.hint }}</p>
                    </details>
                  }
                  
                  @if (task.solution) {
                    <details class="task-solution">
                      <summary>✅ Рішення</summary>
                      <div class="code-block">
                        <pre><code>{{ task.solution }}</code></pre>
                      </div>
                    </details>
                  }
                  
                  @if (!isTaskCompleted(task.id)) {
                    <button 
                      class="btn btn-outline btn-sm"
                      (click)="markTaskCompleted(task.id)">
                      Позначити як виконане
                    </button>
                  }
                </article>
              }
            </div>
          </section>
        }
        
        <!-- Тест -->
        @if (quizInfo()) {
          <section class="quiz-section card">
            <h2>📝 Перевірте свої знання</h2>
            <p>Пройдіть тест після вивчення уроку:</p>
            <div class="quiz-info">
              <div>
                <strong>{{ quizInfo()!.title }}</strong>
                <p class="text-muted">
                  {{ quizInfo()!.questionCount }} питань · 
                  {{ quizInfo()!.totalPoints }} балів
                </p>
              </div>
              <a [routerLink]="['/quiz', quizInfo()!.id]" class="btn btn-secondary">
                Пройти тест →
              </a>
            </div>
          </section>
        }
        
        <!-- Дії -->
        <section class="actions">
          @if (!isLessonCompleted()) {
            <button 
              class="btn btn-primary btn-lg"
              (click)="markLessonCompleted()">
              ✓ Завершити урок
            </button>
          } @else {
            <div class="success">
              ✅ Урок завершено! Чудова робота!
            </div>
          }
          
          <a routerLink="/lessons" class="btn btn-outline">
            ← Назад до уроків
          </a>
        </section>
      }
    </div>
  `,
  styles: [`
    .breadcrumbs {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-lg);
      font-size: 0.875rem;
      color: var(--color-text-secondary);
    }
    
    .breadcrumbs a {
      color: var(--color-secondary);
      text-decoration: none;
    }
    
    .breadcrumbs a:hover {
      text-decoration: underline;
    }
    
    /* Заголовок уроку */
    .lesson-header {
      margin-bottom: var(--spacing-2xl);
    }
    
    .lesson-title-section {
      display: flex;
      align-items: start;
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-lg);
    }
    
    .lesson-number {
      width: 3.5rem;
      height: 3.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--color-primary);
      color: white;
      border-radius: 50%;
      font-weight: 700;
      font-size: 1.5rem;
      flex-shrink: 0;
    }
    
    h1 {
      margin-bottom: var(--spacing-sm);
    }
    
    .lesson-description {
      font-size: 1.125rem;
      color: var(--color-text-secondary);
      margin: 0;
    }
    
    .lesson-meta {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-md);
    }
    
    .meta-item {
      font-size: 0.875rem;
      color: var(--color-text-muted);
    }
    
    .lesson-tags {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-xs);
    }
    
    .tag {
      padding: 0.25rem 0.625rem;
      background-color: var(--color-bg-secondary);
      border-radius: var(--border-radius-sm);
      font-size: 0.75rem;
      color: var(--color-text-secondary);
    }
    
    /* Контент уроку */
    .lesson-content {
      margin-bottom: var(--spacing-2xl);
      line-height: 1.8;
    }
    
    .lesson-content :deep(h2) {
      color: var(--color-primary);
      margin-top: var(--spacing-xl);
    }
    
    .lesson-content :deep(h3) {
      margin-top: var(--spacing-lg);
    }
    
    .lesson-content :deep(ul),
    .lesson-content :deep(ol) {
      margin-left: var(--spacing-xl);
    }
    
    .lesson-content :deep(li) {
      margin-bottom: var(--spacing-sm);
    }
    
    /* Код */
    .code-section {
      margin-bottom: var(--spacing-2xl);
    }
    
    /* Завдання */
    .tasks-section {
      margin-bottom: var(--spacing-2xl);
    }
    
    .tasks-intro {
      color: var(--color-text-secondary);
      margin-bottom: var(--spacing-lg);
    }
    
    .tasks-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }
    
    .task-card {
      background-color: var(--color-bg);
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
      padding: var(--spacing-lg);
      box-shadow: 0 2px 4px var(--color-shadow);
    }
    
    .task-card.completed {
      border-color: var(--color-success);
      background-color: rgba(76, 175, 80, 0.05);
    }
    
    .task-header {
      display: flex;
      align-items: start;
      justify-content: space-between;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-md);
    }
    
    .task-header h3 {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      margin: 0;
      font-size: 1.125rem;
    }
    
    .task-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.75rem;
      height: 1.75rem;
      background-color: var(--color-secondary);
      color: white;
      border-radius: 50%;
      font-size: 0.875rem;
      font-weight: 600;
    }
    
    .completion-badge {
      background-color: var(--color-success);
      color: white;
      width: 1.75rem;
      height: 1.75rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      flex-shrink: 0;
    }
    
    .task-description {
      color: var(--color-text-secondary);
      margin-bottom: var(--spacing-md);
    }
    
    .task-hint,
    .task-solution {
      margin-bottom: var(--spacing-md);
      padding: var(--spacing-md);
      background-color: var(--color-bg-secondary);
      border-radius: var(--border-radius-sm);
    }
    
    .task-hint summary,
    .task-solution summary {
      cursor: pointer;
      font-weight: 600;
      user-select: none;
    }
    
    .task-hint summary:hover,
    .task-solution summary:hover {
      color: var(--color-primary);
    }
    
    .task-hint p,
    .task-solution p {
      margin-top: var(--spacing-sm);
      margin-bottom: 0;
    }
    
    /* Тест */
    .quiz-section {
      margin-bottom: var(--spacing-2xl);
    }
    
    .quiz-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-lg);
      padding: var(--spacing-lg);
      background-color: var(--color-bg-secondary);
      border-radius: var(--border-radius);
    }
    
    /* Дії */
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-md);
      padding-top: var(--spacing-xl);
      border-top: 1px solid var(--color-border);
    }
    
    @media (max-width: 768px) {
      .lesson-title-section {
        flex-direction: column;
      }
      
      .quiz-info {
        flex-direction: column;
        align-items: start;
      }
    }
  `]
})
export class LessonDetailComponent implements OnInit {
  @Input() id!: string; // ID від Router
  
  private lessonService = inject(LessonService);
  private progressService = inject(ProgressService);
  private quizService = inject(QuizService);
  
  // Signals для стану
  lesson = signal<Lesson | null>(null);
  quizInfo = signal<QuizInfo | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  
  ngOnInit(): void {
    if (!this.id) {
      this.error.set('ID уроку не вказано');
      this.loading.set(false);
      return;
    }
    
    this.loadLesson();
    this.loadQuizInfo();
  }
  
  /**
   * Завантажити урок
   */
  private loadLesson(): void {
    this.lessonService.getLesson(this.id).subscribe({
      next: (lesson) => {
        this.lesson.set(lesson);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Помилка завантаження уроку:', err);
        this.error.set('Урок не знайдено');
        this.loading.set(false);
      }
    });
  }
  
  /**
   * Завантажити інформацію про тест
   */
  private loadQuizInfo(): void {
    this.quizService.getQuizByLesson(this.id).subscribe({
      next: (info) => this.quizInfo.set(info),
      error: () => {
        // Тест не знайдено - це нормально, не всі уроки мають тести
        this.quizInfo.set(null);
      }
    });
  }
  
  /**
   * Позначити урок як завершений
   */
  markLessonCompleted(): void {
    this.progressService.completeLesson(this.id).subscribe({
      next: () => {
        console.log('✅ Урок завершено');
      },
      error: (err) => {
        console.error('❌ Помилка збереження прогресу:', err);
      }
    });
  }
  
  /**
   * Позначити завдання як виконане
   */
  markTaskCompleted(taskId: string): void {
    this.progressService.completeTask(this.id, taskId).subscribe({
      next: () => {
        console.log('✅ Завдання виконано');
      },
      error: (err) => {
        console.error('❌ Помилка збереження прогресу:', err);
      }
    });
  }
  
  /**
   * Перевірити чи урок завершено
   */
  isLessonCompleted(): boolean {
    return this.progressService.isLessonCompleted(this.id);
  }
  
  /**
   * Перевірити чи завдання виконано
   */
  isTaskCompleted(taskId: string): boolean {
    return this.progressService.isTaskCompleted(this.id, taskId);
  }
  
  /**
   * Отримати переклад складності
   */
  getDifficultyLabel(difficulty: string): string {
    return this.lessonService.getDifficultyLabel(difficulty as any);
  }
  
  /**
   * Отримати переклад категорії
   */
  getCategoryLabel(category: string): string {
    return this.lessonService.getCategoryLabel(category as any);
  }
}
