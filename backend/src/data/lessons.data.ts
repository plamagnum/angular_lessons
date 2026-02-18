import { Lesson } from '../models/lesson.model';

/**
 * Масив уроків для навчання Angular
 * Містить 7 уроків різної складності з практичними завданнями
 */
export const lessonsData: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Що таке Angular?',
    description: 'Вступ до Angular, архітектура фреймворку та основні концепції',
    category: 'basics',
    difficulty: 'beginner',
    order: 1,
    estimatedMinutes: 15,
    tags: ['основи', 'SPA', 'архітектура', 'standalone'],
    content: `
      <h2>Знайомство з Angular</h2>
      <p>Angular — це потужний фреймворк для створення веб-додатків від Google. Він дозволяє будувати масштабовані Single Page Applications (SPA) з чистою архітектурою.</p>
      
      <h3>Що таке SPA?</h3>
      <p>Single Page Application (Односторінковий додаток) — це веб-додаток, який працює в рамках однієї HTML-сторінки. Замість завантаження нових сторінок з сервера, SPA динамічно оновлює контент на поточній сторінці.</p>
      
      <h3>Основні переваги Angular:</h3>
      <ul>
        <li><strong>TypeScript</strong> — статична типізація підвищує якість коду</li>
        <li><strong>Компонентна архітектура</strong> — код розбивається на незалежні блоки</li>
        <li><strong>Dependency Injection</strong> — зручне управління залежностями</li>
        <li><strong>Потужний CLI</strong> — автоматизація рутинних завдань</li>
        <li><strong>RxJS</strong> — робота з асинхронністю через Observable</li>
      </ul>
      
      <h3>Standalone компоненти (Angular 17+)</h3>
      <p>Сучасний Angular використовує standalone компоненти — вони не потребують NgModule і є самодостатніми одиницями.</p>
    `,
    codeExample: `// Приклад standalone компонента
import { Component } from '@angular/core';

@Component({
  selector: 'app-hello',
  standalone: true, // Компонент працює без NgModule
  template: \`
    <h1>Привіт, Angular! 🅰️</h1>
    <p>{{ message }}</p>
  \`
})
export class HelloComponent {
  message = 'Це мій перший компонент!';
}`,
    tasks: [
      {
        id: 'task-1-1',
        title: 'Створити простий компонент',
        description: 'Створіть standalone компонент WelcomeComponent, який виводить привітання з вашим ім\'ям',
        hint: 'Використовуйте декоратор @Component з полем standalone: true',
        solution: `import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome',
  standalone: true,
  template: '<h1>Привіт, {{ name }}!</h1>'
})
export class WelcomeComponent {
  name = 'Ваше ім\'я';
}`
      },
      {
        id: 'task-1-2',
        title: 'Інтерполяція даних',
        description: 'Додайте в компонент кілька властивостей (вік, місто, хобі) та виведіть їх у шаблоні через інтерполяцію {{ }}',
        hint: 'Створіть властивості класу і використовуйте {{ propertyName }} у шаблоні',
        solution: `import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  template: \`
    <h2>{{ name }}</h2>
    <p>Вік: {{ age }}</p>
    <p>Місто: {{ city }}</p>
    <p>Хобі: {{ hobby }}</p>
  \`
})
export class ProfileComponent {
  name = 'Олександр';
  age = 25;
  city = 'Київ';
  hobby = 'Програмування';
}`
      }
    ]
  },
  {
    id: 'lesson-2',
    title: 'Компоненти та шаблони',
    description: 'Взаємодія компонентів, lifecycle hooks та передача даних',
    category: 'components',
    difficulty: 'beginner',
    order: 2,
    estimatedMinutes: 25,
    tags: ['компоненти', '@Input', '@Output', 'lifecycle', 'data binding'],
    content: `
      <h2>Компоненти в Angular</h2>
      <p>Компонент — це основна будівельна одиниця Angular додатку. Він складається з TypeScript класу, HTML шаблону та CSS стилів.</p>
      
      <h3>Передача даних: @Input та @Output</h3>
      <p><code>@Input()</code> дозволяє передавати дані від батьківського компонента до дочірнього.</p>
      <p><code>@Output()</code> дозволяє відправляти події від дочірнього компонента до батьківського через EventEmitter.</p>
      
      <h3>Lifecycle Hooks</h3>
      <ul>
        <li><code>ngOnInit()</code> — викликається після ініціалізації компонента</li>
        <li><code>ngOnChanges()</code> — викликається при зміні @Input властивостей</li>
        <li><code>ngOnDestroy()</code> — викликається перед знищенням компонента</li>
      </ul>
      
      <h3>Data Binding</h3>
      <ul>
        <li><strong>Інтерполяція:</strong> {{ value }}</li>
        <li><strong>Property binding:</strong> [property]="value"</li>
        <li><strong>Event binding:</strong> (event)="handler()"</li>
        <li><strong>Two-way binding:</strong> [(ngModel)]="property"</li>
      </ul>
    `,
    codeExample: `// Дочірній компонент з @Input та @Output
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: \`
    <div>
      <h3>Лічильник: {{ count }}</h3>
      <button (click)="increment()">+1</button>
      <button (click)="decrement()">-1</button>
    </div>
  \`
})
export class CounterComponent {
  @Input() count = 0; // Отримуємо початкове значення
  @Output() countChange = new EventEmitter<number>(); // Відправляємо зміни
  
  increment() {
    this.count++;
    this.countChange.emit(this.count);
  }
  
  decrement() {
    this.count--;
    this.countChange.emit(this.count);
  }
}

// Батьківський компонент
@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [CounterComponent],
  template: \`
    <app-counter 
      [count]="currentCount"
      (countChange)="onCountChange($event)">
    </app-counter>
  \`
})
export class ParentComponent {
  currentCount = 0;
  
  onCountChange(newCount: number) {
    this.currentCount = newCount;
    console.log('Новe значення:', newCount);
  }
}`,
    tasks: [
      {
        id: 'task-2-1',
        title: 'Створити компонент кнопки',
        description: 'Створіть компонент ButtonComponent з @Input() label та @Output() clicked. При кліку викликайте подію clicked.',
        hint: 'Використовуйте EventEmitter для створення події',
        solution: `import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: \`
    <button (click)="handleClick()">{{ label }}</button>
  \`
})
export class ButtonComponent {
  @Input() label = 'Натисни мене';
  @Output() clicked = new EventEmitter<void>();
  
  handleClick() {
    this.clicked.emit();
  }
}`
      },
      {
        id: 'task-2-2',
        title: 'Реалізувати lifecycle hooks',
        description: 'Створіть компонент, який виводить в консоль повідомлення в ngOnInit та ngOnDestroy',
        hint: 'Реалізуйте інтерфейси OnInit та OnDestroy',
        solution: `import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-lifecycle',
  standalone: true,
  template: '<p>Lifecycle Demo</p>'
})
export class LifecycleComponent implements OnInit, OnDestroy {
  ngOnInit() {
    console.log('Компонент ініціалізовано');
  }
  
  ngOnDestroy() {
    console.log('Компонент знищено');
  }
}`
      }
    ]
  },
  {
    id: 'lesson-3',
    title: 'Директиви та Pipes',
    description: 'Структурні та атрибутні директиви, custom pipes для трансформації даних',
    category: 'directives',
    difficulty: 'beginner',
    order: 3,
    estimatedMinutes: 20,
    tags: ['директиви', '@if', '@for', 'pipes', 'ngClass', 'ngStyle'],
    content: `
      <h2>Директиви в Angular</h2>
      <p>Директиви — це інструкції для Angular, які змінюють поведінку або вигляд елементів у DOM.</p>
      
      <h3>Новий Control Flow (Angular 17+)</h3>
      <p>Замість *ngIf, *ngFor, *ngSwitch тепер використовуються вбудовані блоки:</p>
      <ul>
        <li><code>@if</code> — умовне відображення</li>
        <li><code>@for</code> — цикл по масиву</li>
        <li><code>@switch</code> — множинний вибір</li>
        <li><code>@empty</code> — відображення для порожнього масиву</li>
      </ul>
      
      <h3>Атрибутні директиви</h3>
      <ul>
        <li><code>ngClass</code> — динамічне додавання CSS класів</li>
        <li><code>ngStyle</code> — динамічне додавання стилів</li>
      </ul>
      
      <h3>Pipes (Пайпи)</h3>
      <p>Pipes трансформують дані у шаблонах. Вбудовані pipes: date, uppercase, lowercase, currency, json, slice та інші.</p>
    `,
    codeExample: `// Приклад використання нового control flow
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <h2>Список користувачів</h2>
    
    @if (isLoading) {
      <p>Завантаження...</p>
    } @else if (users.length > 0) {
      <ul>
        @for (user of users; track user.id) {
          <li [ngClass]="{ 'active': user.isActive }">
            {{ user.name | uppercase }} - {{ user.age }} років
          </li>
        } @empty {
          <li>Користувачів не знайдено</li>
        }
      </ul>
    } @else {
      <p>Помилка завантаження</p>
    }
  \`,
  styles: [\`.active { color: green; font-weight: bold; }\`]
})
export class UserListComponent {
  isLoading = false;
  users = [
    { id: 1, name: 'Олександр', age: 25, isActive: true },
    { id: 2, name: 'Марія', age: 30, isActive: false },
    { id: 3, name: 'Іван', age: 28, isActive: true }
  ];
}

// Custom Pipe для обрізання тексту
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 20): string {
    if (!value) return '';
    return value.length > limit 
      ? value.substring(0, limit) + '...' 
      : value;
  }
}

// Використання: {{ longText | truncate:30 }}`,
    tasks: [
      {
        id: 'task-3-1',
        title: 'Використати @for та @if',
        description: 'Створіть компонент, який виводить список завдань. Якщо масив порожній, показуйте "Немає завдань".',
        hint: 'Використовуйте @for з track та @empty',
        solution: `import { Component } from '@angular/core';

@Component({
  selector: 'app-tasks',
  standalone: true,
  template: \`
    <h3>Мої завдання</h3>
    <ul>
      @for (task of tasks; track task.id) {
        <li>{{ task.title }}</li>
      } @empty {
        <li>Немає завдань</li>
      }
    </ul>
  \`
})
export class TasksComponent {
  tasks = [
    { id: 1, title: 'Вивчити Angular' },
    { id: 2, title: 'Зробити проект' }
  ];
}`
      },
      {
        id: 'task-3-2',
        title: 'Створити custom pipe',
        description: 'Створіть pipe CapitalizePipe, який робить першу літеру кожного слова великою',
        hint: 'Використовуйте метод split(), map() та join()',
        solution: `import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize',
  standalone: true
})
export class CapitalizePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return value
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

// Використання: {{ 'привіт світ' | capitalize }} => 'Привіт Світ'`
      }
    ]
  },
  {
    id: 'lesson-4',
    title: 'Сервіси та Dependency Injection',
    description: 'Створення сервісів, inject(), HttpClient та управління станом',
    category: 'services',
    difficulty: 'intermediate',
    order: 4,
    estimatedMinutes: 30,
    tags: ['сервіси', 'DI', 'inject()', 'HttpClient', 'BehaviorSubject'],
    content: `
      <h2>Сервіси в Angular</h2>
      <p>Сервіси — це класи, які виконують бізнес-логіку, роботу з API, управління станом. Вони можуть бути використані в різних компонентах через Dependency Injection.</p>
      
      <h3>Dependency Injection (DI)</h3>
      <p>DI — це патерн проектування, який дозволяє Angular автоматично створювати та надавати залежності компонентам і сервісам.</p>
      
      <h3>Новий inject() API</h3>
      <p>Замість constructor injection тепер можна використовувати функцію <code>inject()</code>:</p>
      <pre><code>private http = inject(HttpClient);</code></pre>
      
      <h3>HttpClient для роботи з API</h3>
      <p>HttpClient — це сервіс для виконання HTTP запитів. Повертає Observable, з яким можна працювати через RxJS оператори.</p>
      
      <h3>BehaviorSubject для стану</h3>
      <p>BehaviorSubject — це тип Observable, який зберігає поточне значення і одразу віддає його новим підписникам.</p>
    `,
    codeExample: `// Приклад сервісу для управління TODO списком
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root' // Сервіс доступний глобально
})
export class TodoService {
  private http = inject(HttpClient); // Новий inject() API
  private apiUrl = '/api/todos';
  
  // BehaviorSubject для зберігання стану
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  public todos$ = this.todosSubject.asObservable();
  
  // Завантажити всі TODO
  loadTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl).pipe(
      tap(todos => this.todosSubject.next(todos))
    );
  }
  
  // Додати нове TODO
  addTodo(title: string): Observable<Todo> {
    const newTodo = { title, completed: false };
    return this.http.post<Todo>(this.apiUrl, newTodo).pipe(
      tap(todo => {
        const current = this.todosSubject.value;
        this.todosSubject.next([...current, todo]);
      })
    );
  }
  
  // Отримати поточний список
  getTodos(): Todo[] {
    return this.todosSubject.value;
  }
}

// Використання в компоненті
import { Component, inject, OnInit } from '@angular/core';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  template: \`
    @for (todo of todos$ | async; track todo.id) {
      <div>{{ todo.title }}</div>
    }
  \`
})
export class TodoListComponent implements OnInit {
  private todoService = inject(TodoService);
  todos$ = this.todoService.todos$;
  
  ngOnInit() {
    this.todoService.loadTodos().subscribe();
  }
}`,
    tasks: [
      {
        id: 'task-4-1',
        title: 'Створити сервіс користувачів',
        description: 'Створіть UserService з методом getUsers(), який повертає масив користувачів',
        hint: 'Використовуйте @Injectable({ providedIn: "root" })',
        solution: `import { Injectable } from '@angular/core';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [
    { id: 1, name: 'Олександр', email: 'alex@example.com' },
    { id: 2, name: 'Марія', email: 'maria@example.com' }
  ];
  
  getUsers(): User[] {
    return this.users;
  }
}`
      },
      {
        id: 'task-4-2',
        title: 'Використати inject() та HttpClient',
        description: 'Створіть сервіс, який використовує inject(HttpClient) для отримання даних з API',
        hint: 'Не забудьте додати provideHttpClient() в appConfig',
        solution: `import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Post {
  id: number;
  title: string;
  body: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jsonplaceholder.typicode.com/posts';
  
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }
  
  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(\`\${this.apiUrl}/\${id}\`);
  }
}`
      }
    ]
  },
  {
    id: 'lesson-5',
    title: 'Маршрутизація (Routing)',
    description: 'Налаштування роутів, lazy loading, guards та resolvers',
    category: 'routing',
    difficulty: 'intermediate',
    order: 5,
    estimatedMinutes: 30,
    tags: ['routing', 'lazy loading', 'guards', 'resolvers', 'navigation'],
    content: `
      <h2>Маршрутизація в Angular</h2>
      <p>Angular Router дозволяє створювати SPA з множиною "сторінок", які завантажуються без перезавантаження браузера.</p>
      
      <h3>Конфігурація Routes</h3>
      <p>Routes — це масив об'єктів, які визначають, який компонент відображати для кожного URL.</p>
      
      <h3>Lazy Loading</h3>
      <p>Lazy loading дозволяє завантажувати компоненти тільки тоді, коли користувач переходить на відповідний маршрут. Це прискорює початкове завантаження додатку.</p>
      
      <h3>Guards (Охоронці)</h3>
      <p>Guards контролюють доступ до маршрутів. Типи guards:</p>
      <ul>
        <li><code>canActivate</code> — чи можна активувати маршрут</li>
        <li><code>canDeactivate</code> — чи можна покинути маршрут</li>
        <li><code>canMatch</code> — чи можна використати маршрут</li>
      </ul>
      
      <h3>Resolvers</h3>
      <p>Resolvers завантажують дані перед активацією маршруту, щоб компонент отримав готові дані.</p>
    `,
    codeExample: `// app.routes.ts
import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

// Functional guard (новий підхід)
export const authGuard = () => {
  const router = inject(Router);
  const isAuthenticated = !!localStorage.getItem('token');
  
  if (!isAuthenticated) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'home', 
    pathMatch: 'full' 
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component')
      .then(m => m.HomeComponent),
    title: 'Головна'
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.component')
      .then(m => m.ProfileComponent),
    canActivate: [authGuard], // Тільки для авторизованих
    title: 'Профіль'
  },
  {
    path: 'users/:id',
    loadComponent: () => import('./user-detail/user-detail.component')
      .then(m => m.UserDetailComponent),
    title: 'Користувач'
  },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found.component')
      .then(m => m.NotFoundComponent),
    title: '404'
  }
];

// Використання в компоненті
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: \`
    <nav>
      <a routerLink="/home" routerLinkActive="active">Головна</a>
      <a routerLink="/profile" routerLinkActive="active">Профіль</a>
    </nav>
  \`,
  styles: [\`.active { font-weight: bold; color: blue; }\`]
})
export class NavComponent {}

// Програмна навігація
import { Router } from '@angular/router';

export class MyComponent {
  private router = inject(Router);
  
  goToProfile(id: number) {
    this.router.navigate(['/users', id]);
  }
}`,
    tasks: [
      {
        id: 'task-5-1',
        title: 'Налаштувати lazy loading',
        description: 'Створіть маршрут /about, який lazy загружає AboutComponent',
        hint: 'Використовуйте loadComponent з динамічним import()',
        solution: `export const routes: Routes = [
  {
    path: 'about',
    loadComponent: () => import('./about/about.component')
      .then(m => m.AboutComponent),
    title: 'Про нас'
  }
];`
      },
      {
        id: 'task-5-2',
        title: 'Створити guard',
        description: 'Створіть functional guard adminGuard, який перевіряє роль користувача',
        hint: 'Поверніть true якщо користувач admin, інакше redirect',
        solution: `import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const adminGuard = () => {
  const router = inject(Router);
  const userRole = localStorage.getItem('role');
  
  if (userRole === 'admin') {
    return true;
  }
  
  router.navigate(['/unauthorized']);
  return false;
};

// Використання
{
  path: 'admin',
  loadComponent: () => import('./admin/admin.component')
    .then(m => m.AdminComponent),
  canActivate: [adminGuard]
}`
      }
    ]
  },
  {
    id: 'lesson-6',
    title: 'Реактивні форми',
    description: 'FormGroup, FormControl, валідація та typed forms',
    category: 'forms',
    difficulty: 'intermediate',
    order: 6,
    estimatedMinutes: 35,
    tags: ['forms', 'FormGroup', 'validators', 'reactive forms'],
    content: `
      <h2>Реактивні форми в Angular</h2>
      <p>Reactive Forms (Реактивні форми) — це підхід до побудови форм, де логіка форми знаходиться в TypeScript класі, а не в шаблоні.</p>
      
      <h3>Основні класи</h3>
      <ul>
        <li><code>FormControl</code> — представляє одне поле форми</li>
        <li><code>FormGroup</code> — група пов'язаних FormControl</li>
        <li><code>FormArray</code> — динамічний масив FormControl</li>
      </ul>
      
      <h3>Валідація</h3>
      <p>Angular надає вбудовані валідатори:</p>
      <ul>
        <li><code>Validators.required</code> — обов'язкове поле</li>
        <li><code>Validators.email</code> — email формат</li>
        <li><code>Validators.minLength(n)</code> — мінімальна довжина</li>
        <li><code>Validators.pattern(regex)</code> — регулярний вираз</li>
      </ul>
      
      <h3>Typed Forms (Angular 14+)</h3>
      <p>TypeScript типізація форм покращує type safety та автодоповнення.</p>
    `,
    codeExample: `// Приклад реактивної форми реєстрації
import { Component, inject } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup, 
  Validators, 
  ReactiveFormsModule 
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: \`
    <form [formGroup]="registrationForm" (ngSubmit)="onSubmit()">
      <div>
        <label>Ім'я:</label>
        <input formControlName="name" type="text">
        @if (name.invalid && name.touched) {
          <span class="error">Ім'я обов'язкове (мін. 2 символи)</span>
        }
      </div>
      
      <div>
        <label>Email:</label>
        <input formControlName="email" type="email">
        @if (email.invalid && email.touched) {
          <span class="error">
            @if (email.errors?.['required']) {
              Email обов'язковий
            }
            @if (email.errors?.['email']) {
              Некоректний email
            }
          </span>
        }
      </div>
      
      <div>
        <label>Пароль:</label>
        <input formControlName="password" type="password">
        @if (password.invalid && password.touched) {
          <span class="error">Пароль мінімум 8 символів</span>
        }
      </div>
      
      <button type="submit" [disabled]="registrationForm.invalid">
        Зареєструватися
      </button>
    </form>
  \`,
  styles: [\`.error { color: red; font-size: 0.875rem; }\`]
})
export class RegistrationComponent {
  private fb = inject(FormBuilder);
  
  // Typed form з автодоповненням
  registrationForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });
  
  // Геттери для зручного доступу до контролів
  get name() { return this.registrationForm.get('name')!; }
  get email() { return this.registrationForm.get('email')!; }
  get password() { return this.registrationForm.get('password')!; }
  
  onSubmit() {
    if (this.registrationForm.valid) {
      console.log('Дані форми:', this.registrationForm.value);
      // Відправка на сервер
    }
  }
}

// Custom валідатор
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordStrengthValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;
  
  const hasNumber = /[0-9]/.test(value);
  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  
  const valid = hasNumber && hasUpper && hasLower;
  return valid ? null : { passwordStrength: true };
}`,
    tasks: [
      {
        id: 'task-6-1',
        title: 'Створити просту форму',
        description: 'Створіть форму логіну з полями username та password з валідацією',
        hint: 'Використовуйте FormBuilder та Validators',
        solution: `import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
      <input formControlName="username" placeholder="Username">
      <input formControlName="password" type="password" placeholder="Password">
      <button type="submit" [disabled]="loginForm.invalid">Login</button>
    </form>
  \`
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  
  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  
  onLogin() {
    console.log(this.loginForm.value);
  }
}`
      },
      {
        id: 'task-6-2',
        title: 'Створити custom валідатор',
        description: 'Створіть валідатор ageValidator, який перевіряє що вік >= 18',
        hint: 'Функція валідатора повертає ValidationErrors | null',
        solution: `import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ageValidator(minAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const age = control.value;
    if (age === null || age === undefined || age === '') {
      return null;
    }
    return age >= minAge ? null : { minAge: { minAge, actual: age } };
  };
}

// Використання
this.fb.group({
  age: ['', [Validators.required, ageValidator(18)]]
})`
      }
    ]
  },
  {
    id: 'lesson-7',
    title: 'Signals та реактивність',
    description: 'Нова реактивна система Angular: signal(), computed(), effect()',
    category: 'advanced',
    difficulty: 'intermediate',
    order: 7,
    estimatedMinutes: 25,
    tags: ['signals', 'computed', 'effect', 'reactivity', 'Angular 17'],
    content: `
      <h2>Signals в Angular</h2>
      <p>Signals — це нова реактивна примітива в Angular 17+, яка спрощує управління станом та автоматично відстежує зміни.</p>
      
      <h3>Основні функції</h3>
      <ul>
        <li><code>signal(value)</code> — створює реактивний сигнал</li>
        <li><code>computed(() => ...)</code> — обчислюване значення на основі інших сигналів</li>
        <li><code>effect(() => ...)</code> — побічний ефект при зміні сигналів</li>
      </ul>
      
      <h3>Переваги Signals</h3>
      <ul>
        <li>Простіший синтаксис ніж RxJS для простих випадків</li>
        <li>Автоматичне відстеження залежностей</li>
        <li>Кращий performance (zoneless change detection)</li>
        <li>Легше дебажити</li>
      </ul>
      
      <h3>Коли використовувати Signals vs RxJS</h3>
      <p><strong>Signals:</strong> локальний стан компонента, прості обчислення</p>
      <p><strong>RxJS:</strong> асинхронні операції, HTTP запити, складні потоки даних</p>
    `,
    codeExample: `// Приклад кошика з Signals
import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <h2>Кошик</h2>
    
    @for (item of items(); track item.id) {
      <div class="cart-item">
        <span>{{ item.name }} - {{ item.price }} грн</span>
        <button (click)="decreaseQuantity(item.id)">-</button>
        <span>{{ item.quantity }}</span>
        <button (click)="increaseQuantity(item.id)">+</button>
        <button (click)="removeItem(item.id)">Видалити</button>
      </div>
    }
    
    <div class="summary">
      <p>Всього товарів: {{ totalItems() }}</p>
      <p>Сума: {{ totalPrice() }} грн</p>
      @if (hasDiscount()) {
        <p class="discount">Знижка 10%: -{{ discount() }} грн</p>
        <p class="total">До сплати: {{ finalPrice() }} грн</p>
      }
    </div>
  \`,
  styles: [\`
    .cart-item { padding: 1rem; border: 1px solid #ccc; margin: 0.5rem 0; }
    .discount { color: green; }
    .total { font-weight: bold; font-size: 1.2rem; }
  \`]
})
export class CartComponent {
  // Реактивний масив товарів
  items = signal<CartItem[]>([
    { id: 1, name: 'Книга Angular', price: 500, quantity: 1 },
    { id: 2, name: 'Курс TypeScript', price: 1200, quantity: 2 }
  ]);
  
  // Computed signals - автоматично перераховуються
  totalItems = computed(() => 
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );
  
  totalPrice = computed(() => 
    this.items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );
  
  hasDiscount = computed(() => this.totalPrice() > 2000);
  
  discount = computed(() => 
    this.hasDiscount() ? this.totalPrice() * 0.1 : 0
  );
  
  finalPrice = computed(() => this.totalPrice() - this.discount());
  
  // Effect - виконується при зміні залежних сигналів
  constructor() {
    effect(() => {
      console.log('Кількість товарів:', this.totalItems());
      console.log('Загальна сума:', this.totalPrice());
    });
  }
  
  // Методи для роботи з кошиком
  increaseQuantity(id: number) {
    this.items.update(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      )
    );
  }
  
  decreaseQuantity(id: number) {
    this.items.update(items => 
      items.map(item => 
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      )
    );
  }
  
  removeItem(id: number) {
    this.items.update(items => items.filter(item => item.id !== id));
  }
}`,
    tasks: [
      {
        id: 'task-7-1',
        title: 'Створити лічильник з Signals',
        description: 'Створіть компонент з signal count та computed isEven, який показує чи парне число',
        hint: 'Використовуйте computed(() => count() % 2 === 0)',
        solution: `import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: \`
    <h2>Лічильник: {{ count() }}</h2>
    <p>Парне: {{ isEven() ? 'Так' : 'Ні' }}</p>
    <button (click)="increment()">+1</button>
    <button (click)="decrement()">-1</button>
  \`
})
export class CounterComponent {
  count = signal(0);
  isEven = computed(() => this.count() % 2 === 0);
  
  increment() {
    this.count.update(val => val + 1);
  }
  
  decrement() {
    this.count.update(val => val - 1);
  }
}`
      },
      {
        id: 'task-7-2',
        title: 'Використати effect()',
        description: 'Додайте effect(), який зберігає значення лічильника в localStorage при кожній зміні',
        hint: 'Викликайте localStorage.setItem всередині effect()',
        solution: `import { Component, signal, effect } from '@angular/core';

@Component({
  selector: 'app-persistent-counter',
  standalone: true,
  template: \`
    <h2>Лічильник: {{ count() }}</h2>
    <button (click)="increment()">+1</button>
  \`
})
export class PersistentCounterComponent {
  count = signal(Number(localStorage.getItem('count') || 0));
  
  constructor() {
    effect(() => {
      localStorage.setItem('count', this.count().toString());
      console.log('Збережено:', this.count());
    });
  }
  
  increment() {
    this.count.update(val => val + 1);
  }
}`
      }
    ]
  }
];
