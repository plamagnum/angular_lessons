import { Injectable, signal, effect } from '@angular/core';

/**
 * Тип теми
 */
export type Theme = 'light' | 'dark';

/**
 * Сервіс для управління темою додатку
 * Використовує Signals для реактивності
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'theme';
  
  // Signal для зберігання поточної теми
  theme = signal<Theme>(this.getInitialTheme());
  
  constructor() {
    // Effect для синхронізації теми з DOM та localStorage
    effect(() => {
      const currentTheme = this.theme();
      document.documentElement.setAttribute('data-theme', currentTheme);
      localStorage.setItem(this.STORAGE_KEY, currentTheme);
    });
  }
  
  /**
   * Визначити початкову тему
   * Пріоритет: localStorage > prefers-color-scheme > 'light'
   */
  private getInitialTheme(): Theme {
    // Перевірити localStorage
    const stored = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    
    // Перевірити системні налаштування
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    // За замовчуванням світла тема
    return 'light';
  }
  
  /**
   * Перемкнути тему
   */
  toggle(): void {
    this.theme.update(current => current === 'light' ? 'dark' : 'light');
  }
  
  /**
   * Встановити конкретну тему
   */
  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }
  
  /**
   * Отримати поточну тему
   */
  getCurrentTheme(): Theme {
    return this.theme();
  }
  
  /**
   * Перевірити чи активна темна тема
   */
  isDark(): boolean {
    return this.theme() === 'dark';
  }
}
