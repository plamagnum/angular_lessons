import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Компонент 404 - сторінка не знайдена
 */
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found">
      <div class="not-found-content">
        <div class="not-found-icon">🤔</div>
        <h1>404</h1>
        <h2>Сторінку не знайдено</h2>
        <p>На жаль, сторінка, яку ви шукаєте, не існує або була переміщена.</p>
        <a routerLink="/" class="btn btn-primary">
          Повернутися на головну
        </a>
      </div>
    </div>
  `,
  styles: [`
    .not-found {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 200px);
      padding: var(--spacing-xl);
    }
    
    .not-found-content {
      text-align: center;
      max-width: 500px;
    }
    
    .not-found-icon {
      font-size: 5rem;
      margin-bottom: var(--spacing-md);
    }
    
    h1 {
      font-size: 6rem;
      color: var(--color-primary);
      margin-bottom: var(--spacing-sm);
    }
    
    h2 {
      margin-bottom: var(--spacing-md);
    }
    
    p {
      color: var(--color-text-secondary);
      margin-bottom: var(--spacing-xl);
    }
  `]
})
export class NotFoundComponent {}
