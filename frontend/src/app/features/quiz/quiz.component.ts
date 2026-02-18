import { Component, inject, Input, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QuizService, Quiz, QuizQuestion, QuizCheckResult } from '@core/services/quiz.service';
import { ProgressService } from '@core/services/progress.service';

/**
 * Стани компонента тесту
 */
type QuizState = 'loading' | 'taking' | 'results';

/**
 * Компонент проходження тесту
 */
@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      @if (state() === 'loading') {
        <div class="loading">Завантаження тесту...</div>
      } @else if (error()) {
        <div class="error">{{ error() }}</div>
        <a routerLink="/lessons" class="btn btn-primary">← Назад до уроків</a>
      } @else if (state() === 'taking' && quiz()) {
        <!-- Заголовок тесту -->
        <header class="quiz-header">
          <h1>{{ quiz()!.title }}</h1>
          <div class="quiz-progress">
            <span>Питання {{ currentQuestionIndex() + 1 }} з {{ quiz()!.questions.length }}</span>
            <div class="progress-bar">
              <div 
                class="progress-bar-fill" 
                [style.width.%]="progressPercentage()">
              </div>
            </div>
          </div>
        </header>
        
        <!-- Поточне питання -->
        @if (currentQuestion()) {
          <section class="question-section card">
            <div class="question-header">
              <span class="question-number">{{ currentQuestionIndex() + 1 }}</span>
              <h2>{{ currentQuestion()!.text }}</h2>
            </div>
            
            <div class="question-type-badge">
              @if (currentQuestion()!.type === 'single') {
                <span class="badge badge-primary">Один варіант</span>
              } @else if (currentQuestion()!.type === 'multiple') {
                <span class="badge badge-warning">Кілька варіантів</span>
              }
            </div>
            
            @if (currentQuestion()!.options) {
              <div class="options-list">
                @for (option of currentQuestion()!.options; track option.id) {
                  <label class="option-item" [class.selected]="isOptionSelected(option.id)">
                    <input 
                      [type]="currentQuestion()!.type === 'single' ? 'radio' : 'checkbox'"
                      [name]="'question-' + currentQuestion()!.id"
                      [value]="option.id"
                      (change)="selectOption(option.id)">
                    <span class="option-text">{{ option.text }}</span>
                  </label>
                }
              </div>
            }
            
            <div class="question-points">
              <span>💎 {{ currentQuestion()!.points }} балів</span>
            </div>
          </section>
        }
        
        <!-- Навігація -->
        <section class="navigation">
          <button 
            class="btn btn-outline"
            [disabled]="currentQuestionIndex() === 0"
            (click)="previousQuestion()">
            ← Попереднє
          </button>
          
          @if (currentQuestionIndex() < quiz()!.questions.length - 1) {
            <button 
              class="btn btn-primary"
              (click)="nextQuestion()">
              Наступне →
            </button>
          } @else {
            <button 
              class="btn btn-success"
              (click)="submitQuiz()">
              Завершити тест ✓
            </button>
          }
        </section>
      } @else if (state() === 'results' && result()) {
        <!-- Результати тесту -->
        <div class="results">
          <div class="results-header">
            <h1>Результати тесту</h1>
            <div class="score-circle" [class.pass]="result()!.percentage >= 70">
              <div class="score-value">{{ result()!.percentage }}%</div>
              <div class="score-label">{{ result()!.score }} / {{ result()!.maxScore }}</div>
            </div>
          </div>
          
          @if (result()!.percentage >= 70) {
            <div class="success">
              🎉 Вітаємо! Ви успішно пройшли тест!
            </div>
          } @else {
            <div class="warning">
              📚 Спробуйте ще раз! Для проходження потрібно набрати мінімум 70%.
            </div>
          }
          
          <!-- Детальні результати -->
          <section class="results-details">
            <h2>Детальні результати</h2>
            @for (questionResult of result()!.results; track questionResult.questionId; let i = $index) {
              <article class="result-card" [class.correct]="questionResult.correct">
                <div class="result-header">
                  <h3>
                    <span class="result-icon">
                      @if (questionResult.correct) {
                        ✅
                      } @else {
                        ❌
                      }
                    </span>
                    Питання {{ i + 1 }}
                  </h3>
                  <span class="result-points">
                    {{ questionResult.earnedPoints }} / {{ questionResult.points }} балів
                  </span>
                </div>
                
                <div class="result-content">
                  <p class="result-question">{{ getQuestionText(questionResult.questionId) }}</p>
                  
                  <div class="result-answers">
                    <div class="answer-section">
                      <strong>Ваша відповідь:</strong>
                      <ul>
                        @for (answerId of questionResult.userAnswers; track answerId) {
                          <li>{{ getOptionText(questionResult.questionId, answerId) }}</li>
                        }
                      </ul>
                    </div>
                    
                    @if (!questionResult.correct) {
                      <div class="answer-section correct-answer">
                        <strong>Правильна відповідь:</strong>
                        <ul>
                          @for (answerId of questionResult.correctAnswers; track answerId) {
                            <li>{{ getOptionText(questionResult.questionId, answerId) }}</li>
                          }
                        </ul>
                      </div>
                    }
                  </div>
                  
                  <div class="result-explanation">
                    <strong>Пояснення:</strong>
                    <p>{{ questionResult.explanation }}</p>
                  </div>
                </div>
              </article>
            }
          </section>
          
          <!-- Дії -->
          <section class="results-actions">
            <button class="btn btn-primary" (click)="retakeQuiz()">
              🔄 Пройти ще раз
            </button>
            <a routerLink="/lessons" class="btn btn-outline">
              ← Назад до уроків
            </a>
          </section>
        </div>
      }
    </div>
  `,
  styles: [`
    /* Заголовок тесту */
    .quiz-header {
      margin-bottom: var(--spacing-2xl);
    }
    
    .quiz-progress {
      margin-top: var(--spacing-md);
    }
    
    .quiz-progress span {
      display: block;
      margin-bottom: var(--spacing-sm);
      font-size: 0.875rem;
      color: var(--color-text-secondary);
    }
    
    /* Питання */
    .question-section {
      margin-bottom: var(--spacing-xl);
    }
    
    .question-header {
      display: flex;
      align-items: start;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
    }
    
    .question-number {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      background-color: var(--color-secondary);
      color: white;
      border-radius: 50%;
      font-weight: 700;
      flex-shrink: 0;
    }
    
    .question-header h2 {
      margin: 0;
      font-size: 1.25rem;
    }
    
    .question-type-badge {
      margin-bottom: var(--spacing-lg);
    }
    
    /* Варіанти відповіді */
    .options-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
    }
    
    .option-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-md);
      background-color: var(--color-bg-secondary);
      border: 2px solid transparent;
      border-radius: var(--border-radius);
      cursor: pointer;
      transition: all var(--transition);
    }
    
    .option-item:hover {
      background-color: var(--color-bg-tertiary);
      border-color: var(--color-secondary);
    }
    
    .option-item.selected {
      background-color: var(--color-bg-tertiary);
      border-color: var(--color-primary);
    }
    
    .option-item input {
      cursor: pointer;
    }
    
    .option-text {
      flex: 1;
      cursor: pointer;
    }
    
    .question-points {
      text-align: right;
      color: var(--color-text-muted);
      font-size: 0.875rem;
    }
    
    /* Навігація */
    .navigation {
      display: flex;
      justify-content: space-between;
      gap: var(--spacing-md);
    }
    
    /* Результати */
    .results {
      max-width: 900px;
      margin: 0 auto;
    }
    
    .results-header {
      text-align: center;
      margin-bottom: var(--spacing-2xl);
    }
    
    .score-circle {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 150px;
      height: 150px;
      border: 5px solid var(--color-danger);
      border-radius: 50%;
      margin-top: var(--spacing-lg);
    }
    
    .score-circle.pass {
      border-color: var(--color-success);
    }
    
    .score-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--color-primary);
    }
    
    .score-label {
      font-size: 1rem;
      color: var(--color-text-secondary);
    }
    
    .warning {
      background-color: rgba(255, 152, 0, 0.1);
      border-left: 4px solid var(--color-warning);
      padding: var(--spacing-md);
      margin-bottom: var(--spacing-xl);
      border-radius: var(--border-radius);
    }
    
    /* Детальні результати */
    .results-details {
      margin-bottom: var(--spacing-2xl);
    }
    
    .result-card {
      background-color: var(--color-bg);
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
      padding: var(--spacing-lg);
      margin-bottom: var(--spacing-lg);
      box-shadow: 0 2px 4px var(--color-shadow);
    }
    
    .result-card.correct {
      border-left: 4px solid var(--color-success);
    }
    
    .result-card:not(.correct) {
      border-left: 4px solid var(--color-danger);
    }
    
    .result-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--spacing-md);
    }
    
    .result-header h3 {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      margin: 0;
      font-size: 1.125rem;
    }
    
    .result-icon {
      font-size: 1.25rem;
    }
    
    .result-points {
      font-weight: 600;
      color: var(--color-primary);
    }
    
    .result-question {
      font-weight: 500;
      margin-bottom: var(--spacing-md);
    }
    
    .result-answers {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-md);
    }
    
    .answer-section {
      padding: var(--spacing-md);
      background-color: var(--color-bg-secondary);
      border-radius: var(--border-radius-sm);
    }
    
    .answer-section.correct-answer {
      background-color: rgba(76, 175, 80, 0.1);
    }
    
    .answer-section ul {
      margin: var(--spacing-sm) 0 0 var(--spacing-lg);
    }
    
    .result-explanation {
      padding: var(--spacing-md);
      background-color: var(--color-bg-secondary);
      border-radius: var(--border-radius-sm);
    }
    
    .result-explanation p {
      margin: var(--spacing-sm) 0 0 0;
      color: var(--color-text-secondary);
    }
    
    /* Дії результатів */
    .results-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-md);
      justify-content: center;
    }
  `]
})
export class QuizComponent implements OnInit {
  @Input() id!: string; // ID тесту від Router
  
  private quizService = inject(QuizService);
  private progressService = inject(ProgressService);
  
  // Signals для стану
  state = signal<QuizState>('loading');
  quiz = signal<Quiz | null>(null);
  error = signal<string | null>(null);
  currentQuestionIndex = signal(0);
  userAnswers = signal<Record<string, string[]>>({});
  result = signal<QuizCheckResult | null>(null);
  
  // Computed signals
  currentQuestion = computed(() => {
    const q = this.quiz();
    const idx = this.currentQuestionIndex();
    return q ? q.questions[idx] : null;
  });
  
  progressPercentage = computed(() => {
    const q = this.quiz();
    if (!q) return 0;
    return ((this.currentQuestionIndex() + 1) / q.questions.length) * 100;
  });
  
  ngOnInit(): void {
    if (!this.id) {
      this.error.set('ID тесту не вказано');
      return;
    }
    
    this.loadQuiz();
  }
  
  /**
   * Завантажити тест
   */
  private loadQuiz(): void {
    this.quizService.getQuiz(this.id).subscribe({
      next: (quiz) => {
        this.quiz.set(quiz);
        this.state.set('taking');
        // Ініціалізувати відповіді
        const answers: Record<string, string[]> = {};
        quiz.questions.forEach(q => {
          answers[q.id] = [];
        });
        this.userAnswers.set(answers);
      },
      error: (err) => {
        console.error('Помилка завантаження тесту:', err);
        this.error.set('Тест не знайдено');
      }
    });
  }
  
  /**
   * Вибрати варіант відповіді
   */
  selectOption(optionId: string): void {
    const question = this.currentQuestion();
    if (!question) return;
    
    this.userAnswers.update(answers => {
      const questionAnswers = [...answers[question.id]];
      
      if (question.type === 'single') {
        // Один варіант - замінити
        return { ...answers, [question.id]: [optionId] };
      } else {
        // Множинний вибір - toggle
        const index = questionAnswers.indexOf(optionId);
        if (index > -1) {
          questionAnswers.splice(index, 1);
        } else {
          questionAnswers.push(optionId);
        }
        return { ...answers, [question.id]: questionAnswers };
      }
    });
  }
  
  /**
   * Перевірити чи варіант вибрано
   */
  isOptionSelected(optionId: string): boolean {
    const question = this.currentQuestion();
    if (!question) return false;
    return this.userAnswers()[question.id]?.includes(optionId) || false;
  }
  
  /**
   * Попереднє питання
   */
  previousQuestion(): void {
    this.currentQuestionIndex.update(idx => Math.max(0, idx - 1));
  }
  
  /**
   * Наступне питання
   */
  nextQuestion(): void {
    const q = this.quiz();
    if (!q) return;
    this.currentQuestionIndex.update(idx => Math.min(q.questions.length - 1, idx + 1));
  }
  
  /**
   * Відправити тест на перевірку
   */
  submitQuiz(): void {
    const answers = this.userAnswers();
    this.quizService.checkAnswers(this.id, answers).subscribe({
      next: (result) => {
        this.result.set(result);
        this.state.set('results');
        
        // Зберегти результат
        this.progressService.saveQuizResult(
          this.id,
          result.score,
          result.maxScore,
          answers
        ).subscribe();
      },
      error: (err) => {
        console.error('Помилка перевірки тесту:', err);
        this.error.set('Помилка перевірки відповідей');
      }
    });
  }
  
  /**
   * Пройти тест знову
   */
  retakeQuiz(): void {
    this.currentQuestionIndex.set(0);
    const answers: Record<string, string[]> = {};
    this.quiz()!.questions.forEach(q => {
      answers[q.id] = [];
    });
    this.userAnswers.set(answers);
    this.result.set(null);
    this.state.set('taking');
  }
  
  /**
   * Отримати текст питання за ID
   */
  getQuestionText(questionId: string): string {
    const question = this.quiz()?.questions.find(q => q.id === questionId);
    return question?.text || '';
  }
  
  /**
   * Отримати текст варіанту за ID
   */
  getOptionText(questionId: string, optionId: string): string {
    const question = this.quiz()?.questions.find(q => q.id === questionId);
    const option = question?.options?.find(o => o.id === optionId);
    return option?.text || optionId;
  }
}
