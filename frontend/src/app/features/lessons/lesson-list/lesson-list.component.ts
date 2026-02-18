import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LessonService, Lesson, LessonCategory, Difficulty } from '@core/services/lesson.service';
import { ProgressService } from '@core/services/progress.service';

/**
 * Компонент списку уроків з фільтрацією
 */
@Component({
  selector: 'app-lesson-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <h1>Уроки Angular</h1>
      
      <!-- Фільтри -->
      <section class="filters">
        <div class="filter-group">
          <label for="search">🔍 Пошук:</label>
          <input 
            id="search"
            type="text" 
            [(ngModel)]="searchQuery"
            (ngModelChange)="applyFilters()"
            placeholder="Назва або тег...">
        </div>
        
        <div class="filter-group">
          <label for="difficulty">Складність:</label>
          <select 
            id="difficulty"
            [(ngModel)]="selectedDifficulty"
            (ngModelChange)="applyFilters()">
            <option value="">Всі</option>
            <option value="beginner">Початковий</option>
            <option value="intermediate">Середній</option>
            <option value="advanced">Просунутий</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="category">Категорія:</label>
          <select 
            id="category"
            [(ngModel)]="selectedCategory"
            (ngModelChange)="applyFilters()">
            <option value="">Всі</option>
            <option value="basics">Основи</option>
            <option value="components">Компоненти</option>
            <option value="directives">Директиви</option>
            <option value="services">Сервіси</option>
            <option value="routing">Маршрутизація</option>
            <option value="forms">Форми</option>
            <option value="advanced">Просунуті</option>
          </select>
        </div>
        
        <button class="btn btn-outline btn-sm" (click)="resetFilters()">
          Скинути фільтри
        </button>
      </section>
      
      <!-- Результати -->
      @if (loading()) {
        <div class="loading">Завантаження уроків...</div>
      } @else if (error()) {
        <div class="error">{{ error() }}</div>
      } @else {
        <div class="lessons-info">
          <p>Знайдено уроків: <strong>{{ filteredLessons().length }}</strong></p>
        </div>
        
        @if (filteredLessons().length === 0) {
          <div class="no-results">
            <p>😕 Не знайдено уроків за вказаними фільтрами</p>
            <button class="btn btn-primary" (click)="resetFilters()">
              Скинути фільтри
            </button>
          </div>
        } @else {
          <div class="lessons-grid">
            @for (lesson of filteredLessons(); track lesson.id; let i = $index) {
              <article 
                class="lesson-card" 
                [class.completed]="isCompleted(lesson.id)"
                [style.animation-delay.s]="i * 0.05">
                <div class="lesson-header">
                  <div class="lesson-number">{{ lesson.order }}</div>
                  @if (isCompleted(lesson.id)) {
                    <span class="completion-badge">✓</span>
                  }
                </div>
                
                <h3>
                  <a [routerLink]="['/lessons', lesson.id]">{{ lesson.title }}</a>
                </h3>
                
                <p class="lesson-description">{{ lesson.description }}</p>
                
                <div class="lesson-meta">
                  <span 
                    class="badge" 
                    [class.badge-beginner]="lesson.difficulty === 'beginner'"
                    [class.badge-intermediate]="lesson.difficulty === 'intermediate'"
                    [class.badge-advanced]="lesson.difficulty === 'advanced'">
                    {{ getDifficultyLabel(lesson.difficulty) }}
                  </span>
                  <span class="badge badge-secondary">{{ getCategoryLabel(lesson.category) }}</span>
                  <span class="meta-item">⏱️ {{ lesson.estimatedMinutes }} хв</span>
                </div>
                
                <div class="lesson-tags">
                  @for (tag of lesson.tags; track tag) {
                    <span class="tag">{{ tag }}</span>
                  }
                </div>
                
                <div class="lesson-footer">
                  <span class="tasks-count">📋 {{ lesson.tasks.length }} завдань</span>
                  <a [routerLink]="['/lessons', lesson.id]" class="btn btn-primary btn-sm">
                    @if (isCompleted(lesson.id)) {
                      Повторити →
                    } @else {
                      Почати →
                    }
                  </a>
                </div>
              </article>
            }
          </div>
        }
      }
    </div>
  `,
  styles: [`
    h1 {
      margin-bottom: var(--spacing-xl);
    }
    
    /* Фільтри */
    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-md);
      padding: var(--spacing-lg);
      background-color: var(--color-bg-secondary);
      border-radius: var(--border-radius);
      margin-bottom: var(--spacing-xl);
    }
    
    .filter-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
      flex: 1;
      min-width: 200px;
    }
    
    .filter-group label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-secondary);
    }
    
    .filter-group input,
    .filter-group select {
      padding: 0.5rem;
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius-sm);
      background-color: var(--color-bg);
      color: var(--color-text);
      font-family: var(--font-family);
      font-size: 1rem;
    }
    
    .lessons-info {
      margin-bottom: var(--spacing-lg);
      color: var(--color-text-secondary);
    }
    
    .no-results {
      text-align: center;
      padding: var(--spacing-2xl);
    }
    
    .no-results p {
      font-size: 1.125rem;
      margin-bottom: var(--spacing-lg);
    }
    
    /* Сітка уроків */
    .lessons-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
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
      animation: fadeIn 0.3s ease-in-out both;
    }
    
    .lesson-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 16px var(--color-shadow);
    }
    
    .lesson-card.completed {
      border-color: var(--color-success);
      background: linear-gradient(135deg, var(--color-bg) 0%, rgba(76, 175, 80, 0.05) 100%);
    }
    
    .lesson-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
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
      font-size: 1.125rem;
    }
    
    .completion-badge {
      background-color: var(--color-success);
      color: white;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
    
    h3 {
      margin: 0;
      font-size: 1.25rem;
    }
    
    h3 a {
      color: var(--color-text);
      text-decoration: none;
      transition: color var(--transition);
    }
    
    h3 a:hover {
      color: var(--color-primary);
    }
    
    .lesson-description {
      color: var(--color-text-secondary);
      font-size: 0.875rem;
      margin: 0;
      line-height: 1.5;
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
    
    .lesson-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: auto;
      padding-top: var(--spacing-md);
      border-top: 1px solid var(--color-border);
    }
    
    .tasks-count {
      font-size: 0.875rem;
      color: var(--color-text-muted);
    }
  `]
})
export class LessonListComponent implements OnInit {
  private lessonService = inject(LessonService);
  private progressService = inject(ProgressService);
  
  // Signals для стану
  allLessons = signal<Lesson[]>([]);
  filteredLessons = signal<Lesson[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  
  // Фільтри
  searchQuery = '';
  selectedDifficulty: Difficulty | '' = '';
  selectedCategory: LessonCategory | '' = '';
  
  ngOnInit(): void {
    this.loadLessons();
  }
  
  /**
   * Завантажити всі уроки
   */
  private loadLessons(): void {
    this.lessonService.getAllCached().subscribe({
      next: (lessons) => {
        this.allLessons.set(lessons);
        this.filteredLessons.set(lessons);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Помилка завантаження уроків:', err);
        this.error.set('Не вдалося завантажити уроки');
        this.loading.set(false);
      }
    });
  }
  
  /**
   * Застосувати фільтри
   */
  applyFilters(): void {
    let filtered = [...this.allLessons()];
    
    // Фільтр по пошуку
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(lesson => 
        lesson.title.toLowerCase().includes(query) ||
        lesson.description.toLowerCase().includes(query) ||
        lesson.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Фільтр по складності
    if (this.selectedDifficulty) {
      filtered = filtered.filter(lesson => lesson.difficulty === this.selectedDifficulty);
    }
    
    // Фільтр по категорії
    if (this.selectedCategory) {
      filtered = filtered.filter(lesson => lesson.category === this.selectedCategory);
    }
    
    this.filteredLessons.set(filtered);
  }
  
  /**
   * Скинути всі фільтри
   */
  resetFilters(): void {
    this.searchQuery = '';
    this.selectedDifficulty = '';
    this.selectedCategory = '';
    this.filteredLessons.set(this.allLessons());
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
  getDifficultyLabel(difficulty: Difficulty): string {
    return this.lessonService.getDifficultyLabel(difficulty);
  }
  
  /**
   * Отримати переклад категорії
   */
  getCategoryLabel(category: LessonCategory): string {
    return this.lessonService.getCategoryLabel(category);
  }
}
