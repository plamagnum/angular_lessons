import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';

/**
 * Конфігурація Angular додатку
 * Використовує functional providers замість NgModule
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()), // Router з підтримкою @Input() від URL параметрів
    provideHttpClient(), // HttpClient для API запитів
    provideAnimations() // Анімації
  ]
};
