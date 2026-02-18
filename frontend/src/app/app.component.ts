import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { ProgressService } from '@core/services/progress.service';

/**
 * Головний компонент додатку
 * Містить layout структуру (header, main, footer)
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header />
    <main class="main-content">
      <router-outlet />
    </main>
    <footer class="footer">
      <div class="container">
        <p>Angular Learning Hub © 2026 | Створено для вивчення Angular 🅰️</p>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    .main-content {
      flex: 1;
      padding: var(--spacing-xl) 0;
    }
    
    .footer {
      background-color: var(--color-bg-secondary);
      border-top: 1px solid var(--color-border);
      padding: var(--spacing-lg) 0;
      margin-top: var(--spacing-2xl);
    }
    
    .footer p {
      text-align: center;
      color: var(--color-text-secondary);
      margin: 0;
      font-size: 0.875rem;
    }
  `]
})
export class AppComponent implements OnInit {
  private progressService = inject(ProgressService);
  
  /**
   * Завантажити прогрес користувача при старті додатку
   */
  ngOnInit(): void {
    this.progressService.loadProgress().subscribe({
      next: () => console.log('✅ Прогрес завантажено'),
      error: (err) => console.error('❌ Помилка завантаження прогресу:', err)
    });
  }
}
