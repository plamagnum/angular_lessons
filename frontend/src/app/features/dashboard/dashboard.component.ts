import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LessonService, Lesson } from '@core/services/lesson.service';
import { ProgressService } from '@core/services/progress.service';

/**
 * Компонент головної сторінки (Dashboard)
 * Показує загальну статистику, список уроків та поради
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <!-- Привітання -->
      <section class="welcome">
        <h1>Вітаємо в Angular Learning Hub! 🅰️</h1>
        <p class="welcome-text">
          Інтерактивна платформа для вивчення Angular з уроками, тестами та відстеженням прогресу.
        </p>
      </section>
      
      <!-- Статистика -->
      <section class="stats">
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-content">
            <div class="stat-value">{{ completedLessonsCount() }} / {{ totalLessonsCount() }}</div>
            <div class="stat-label">Уроків завершено</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-content">
            <div class="stat-value">{{ progressService.totalPoints() }}</div>
            <div class="stat-label">Балів зібрано</div>
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
      
      <!-- Прогрес-бар -->
      <section class="overall-progress">
        <h2>Загальний прогрес</h2>
        <div class="progress-bar">
          <div 
            class="progress-bar-fill" 
            [style.width.%]="overallProgress()">
          </div>
        </div>
        <p class="progress-text">{{ overallProgress() }}% завершено</p>
      </section>
      
      <!-- Сітка уроків -->
      <section class="lessons-section">
        <h2>Уроки</h2>
        
        @if (loading()) {
          <div class="loading">Завантаження уроків...</div>
        } @else if (error()) {
          <div class="error">{{ error() }}</div>
        } @else {
          <div class="lessons-grid">
            @for (lesson of lessons(); track lesson.id) {
              <article class="lesson-card" [class.completed]="isCompleted(lesson.id)">
                <div class="lesson-header">
                  <h3>
                    <a [routerLink]="['/lessons', lesson.id]">{{ lesson.title }}</a>
                  </h3>
                  @if (isCompleted(lesson.id)) {
                    <span class="completion-badge">✓</span>
                  }
                </div>
                
                <p class="lesson-description">{{ lesson.description }}</p>
                
                <div class="lesson-meta">
                  <span 
                    class="badge" 
                    [class.badge-beginner]="lesson.difficulty === 'beginner'"
                    [class.badge-intermediate]="lesson.difficulty === 'intermediate'"
                    [class.badge-advanced]="lesson.difficulty === 'advanced'">
                    {{ getDifficultyLabel(lesson.difficulty) }}
                  </span>
                  <span class="meta-item">⏱️ {{ lesson.estimatedMinutes }} хв</span>
                  <span class="meta-item">📋 {{ lesson.tasks.length }} завдань</span>
                </div>
                
                <div class="lesson-tags">
                  @for (tag of lesson.tags; track tag) {
                    <span class="tag">{{ tag }}</span>
                  }
                </div>
                
                <a [routerLink]="['/lessons', lesson.id]" class="btn btn-outline btn-sm">
                  Почати урок →
                </a>
              </article>
            }
          </div>
        }
      </section>
      
      <!-- Поради для вивчення -->
      <section class="tips">
        <h2>💡 Поради для ефективного навчання</h2>
        <div class="tips-grid">
          <div class="tip-card">
            <div class="tip-icon">📅</div>
            <h3>Регулярність</h3>
            <p>Займайтесь щодня хоча б 15-30 хвилин для кращого засвоєння матеріалу.</p>
          </div>
          
          <div class="tip-card">
            <div class="tip-icon">💻</div>
            <h3>Практика</h3>
            <p>Виконуйте всі практичні завдання та експериментуйте з кодом.</p>
          </div>
          
          <div class="tip-card">
            <div class="tip-icon">📝</div>
            <h3>Конспекти</h3>
            <p>Ведіть нотатки та створюйте власні приклади для кращого розуміння.</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .welcome {
      margin-bottom: var(--spacing-2xl);
      text-align: center;
    }
    
    .welcome-text {
      font-size: 1.125rem;
      color: var(--color-text-secondary);
      max-width: 700px;
      margin: 0 auto;
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
    
    .stat-content {
      flex: 1;
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
    
    .progress-text {
      text-align: center;
      font-weight: 600;
      color: var(--color-primary);
    }
    
    /* Уроки */
    .lessons-section {
      margin-bottom: var(--spacing-2xl);
    }
    
    .lessons-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--spacing-lg);
    }
    
    .lesson-card {
      background-color: var(--color-bg);
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
      padding: var(--spacing-lg);
      box-shadow: 0 2px 8px var(--color-shadow);
      transition: all var(--transition);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
      animation: fadeIn 0.3s ease-in-out;
    }
    
    .lesson-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px var(--color-shadow);
    }
    
    /* Додати затримку анімації для кожної картки */
    @for $i from 1 through 10 {
      .lesson-card:nth-child(#{$i}) {
        animation-delay: #{$i * 0.05}s;
      }
    }
    
    .lesson-card.completed {
      border-color: var(--color-success);
      background-color: rgba(76, 175, 80, 0.05);
    }
    
    .lesson-header {
      display: flex;
      align-items: start;
      justify-content: space-between;
      gap: var(--spacing-sm);
    }
    
    .lesson-header h3 {
      margin: 0;
      font-size: 1.25rem;
    }
    
    .lesson-header h3 a {
      color: var(--color-text);
      text-decoration: none;
    }
    
    .lesson-header h3 a:hover {
      color: var(--color-primary);
    }
    
    .completion-badge {
      background-color: var(--color-success);
      color: white;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      flex-shrink: 0;
    }
    
    .lesson-description {
      color: var(--color-text-secondary);
      font-size: 0.875rem;
      margin: 0;
    }
    
    .lesson-meta {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-sm);
      align-items: center;
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
      padding: 0.25rem 0.5rem;
      background-color: var(--color-bg-secondary);
      border-radius: var(--border-radius-sm);
      font-size: 0.75rem;
      color: var(--color-text-secondary);
    }
    
    /* Поради */
    .tips {
      margin-bottom: var(--spacing-2xl);
    }
    
    .tips-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--spacing-lg);
    }
    
    .tip-card {
      padding: var(--spacing-lg);
      background-color: var(--color-bg-secondary);
      border-radius: var(--border-radius);
      text-align: center;
    }
    
    .tip-icon {
      font-size: 2.5rem;
      margin-bottom: var(--spacing-sm);
    }
    
    .tip-card h3 {
      font-size: 1.125rem;
      margin-bottom: var(--spacing-sm);
    }
    
    .tip-card p {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      margin: 0;
    }
  `]
})
export class DashboardComponent implements OnInit {
  private lessonService = inject(LessonService);
  progressService = inject(ProgressService);
  
  // Signals для стану компонента
  lessons = signal<Lesson[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  
  // Computed signals
  totalLessonsCount = computed(() => this.lessons().length);
  completedLessonsCount = computed(() => this.progressService.completedLessonsCount());
  overallProgress = computed(() => {
    const total = this.totalLessonsCount();
    if (total === 0) return 0;
    return Math.round((this.completedLessonsCount() / total) * 100);
  });
  
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
        this.error.set('Не вдалося завантажити уроки. Спробуйте пізніше.');
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
   * Отримати переклад складності
   */
  getDifficultyLabel(difficulty: string): string {
    return this.lessonService.getDifficultyLabel(difficulty as any);
  }
}
