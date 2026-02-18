import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '@core/services/theme.service';
import { ProgressService } from '@core/services/progress.service';

/**
 * Компонент header з навігацією та перемикачем теми
 * Використовує Signals для реактивності
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="container">
        <div class="header-content">
          <!-- Лого та назва -->
          <div class="header-brand">
            <a routerLink="/" class="brand-link">
              <span class="brand-icon">🅰️</span>
              <span class="brand-text">Angular Learning Hub</span>
            </a>
          </div>
          
          <!-- Навігація (Desktop) -->
          <nav class="nav-desktop">
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
              Головна
            </a>
            <a routerLink="/lessons" routerLinkActive="active" class="nav-link">
              Уроки
            </a>
            <a routerLink="/progress" routerLinkActive="active" class="nav-link">
              Прогрес
            </a>
          </nav>
          
          <!-- Права частина (бали + тема + burger) -->
          <div class="header-actions">
            <!-- Бали користувача -->
            <div class="user-points">
              <span class="points-icon">⭐</span>
              <span class="points-value">{{ progressService.totalPoints() }}</span>
            </div>
            
            <!-- Перемикач теми -->
            <button 
              class="theme-toggle" 
              (click)="themeService.toggle()"
              [attr.aria-label]="themeService.isDark() ? 'Світла тема' : 'Темна тема'"
              [title]="themeService.isDark() ? 'Світла тема' : 'Темна тема'">
              <span class="theme-icon">{{ themeService.isDark() ? '☀️' : '🌙' }}</span>
            </button>
            
            <!-- Мобільне меню (burger) -->
            <button 
              class="burger-menu" 
              (click)="toggleMobileMenu()"
              [class.active]="mobileMenuOpen()"
              aria-label="Меню">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
        
        <!-- Мобільна навігація -->
        @if (mobileMenuOpen()) {
          <nav class="nav-mobile">
            <a 
              routerLink="/dashboard" 
              routerLinkActive="active" 
              class="nav-link"
              (click)="closeMobileMenu()">
              Головна
            </a>
            <a 
              routerLink="/lessons" 
              routerLinkActive="active" 
              class="nav-link"
              (click)="closeMobileMenu()">
              Уроки
            </a>
            <a 
              routerLink="/progress" 
              routerLinkActive="active" 
              class="nav-link"
              (click)="closeMobileMenu()">
              Прогрес
            </a>
          </nav>
        }
      </div>
    </header>
  `,
  styles: [`
    .header {
      background-color: var(--color-bg);
      border-bottom: 1px solid var(--color-border);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 4px var(--color-shadow);
    }
    
    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 0;
      gap: 1rem;
    }
    
    /* Бренд */
    .header-brand {
      flex-shrink: 0;
    }
    
    .brand-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--color-text);
    }
    
    .brand-icon {
      font-size: 1.75rem;
    }
    
    .brand-text {
      display: none;
    }
    
    /* Desktop навігація */
    .nav-desktop {
      display: none;
      gap: 1.5rem;
    }
    
    .nav-link {
      color: var(--color-text-secondary);
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: var(--border-radius-sm);
      transition: all var(--transition);
    }
    
    .nav-link:hover {
      color: var(--color-primary);
      background-color: var(--color-bg-secondary);
    }
    
    .nav-link.active {
      color: var(--color-primary);
      background-color: var(--color-bg-secondary);
    }
    
    /* Права частина */
    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .user-points {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.375rem 0.75rem;
      background-color: var(--color-bg-secondary);
      border-radius: var(--border-radius-sm);
      font-weight: 600;
    }
    
    .points-icon {
      font-size: 1rem;
    }
    
    .points-value {
      color: var(--color-primary);
    }
    
    .theme-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border: none;
      background-color: var(--color-bg-secondary);
      border-radius: var(--border-radius-sm);
      cursor: pointer;
      transition: all var(--transition);
    }
    
    .theme-toggle:hover {
      background-color: var(--color-bg-tertiary);
    }
    
    .theme-icon {
      font-size: 1.25rem;
    }
    
    /* Burger menu */
    .burger-menu {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      width: 2.5rem;
      height: 2.5rem;
      padding: 0.5rem;
      border: none;
      background-color: var(--color-bg-secondary);
      border-radius: var(--border-radius-sm);
      cursor: pointer;
      transition: all var(--transition);
    }
    
    .burger-menu span {
      display: block;
      width: 100%;
      height: 2px;
      background-color: var(--color-text);
      transition: all var(--transition);
    }
    
    .burger-menu.active span:nth-child(1) {
      transform: translateY(6px) rotate(45deg);
    }
    
    .burger-menu.active span:nth-child(2) {
      opacity: 0;
    }
    
    .burger-menu.active span:nth-child(3) {
      transform: translateY(-6px) rotate(-45deg);
    }
    
    /* Мобільна навігація */
    .nav-mobile {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1rem 0;
      border-top: 1px solid var(--color-border);
      animation: fadeIn 0.2s ease-in-out;
    }
    
    /* Tablet і більше */
    @media (min-width: 768px) {
      .brand-text {
        display: inline;
      }
      
      .nav-desktop {
        display: flex;
      }
      
      .burger-menu {
        display: none;
      }
      
      .nav-mobile {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  themeService = inject(ThemeService);
  progressService = inject(ProgressService);
  
  // Signal для управління станом мобільного меню
  mobileMenuOpen = signal(false);
  
  /**
   * Перемкнути мобільне меню
   */
  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(open => !open);
  }
  
  /**
   * Закрити мобільне меню
   */
  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
