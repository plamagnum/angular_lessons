import { Quiz } from '../models/quiz.model';

/**
 * Масив тестів для перевірки знань
 * Містить 3 тести з різними типами питань
 */
export const quizzesData: Quiz[] = [
  {
    id: 'quiz-1',
    lessonId: 'lesson-1',
    title: 'Основи Angular',
    questions: [
      {
        id: 'q1-1',
        text: 'Що таке Angular?',
        type: 'single',
        options: [
          { id: 'a', text: 'Бібліотека для роботи з DOM', isCorrect: false },
          { id: 'b', text: 'Фреймворк для створення SPA', isCorrect: true },
          { id: 'c', text: 'CSS фреймворк', isCorrect: false },
          { id: 'd', text: 'Мова програмування', isCorrect: false }
        ],
        explanation: 'Angular — це потужний фреймворк від Google для створення Single Page Applications (SPA) з використанням TypeScript.',
        points: 10
      },
      {
        id: 'q1-2',
        text: 'Яка мова використовується в Angular за замовчуванням?',
        type: 'single',
        options: [
          { id: 'a', text: 'JavaScript', isCorrect: false },
          { id: 'b', text: 'TypeScript', isCorrect: true },
          { id: 'c', text: 'Python', isCorrect: false },
          { id: 'd', text: 'Java', isCorrect: false }
        ],
        explanation: 'Angular використовує TypeScript — надмножину JavaScript з статичною типізацією.',
        points: 10
      },
      {
        id: 'q1-3',
        text: 'Що таке standalone компонент?',
        type: 'single',
        options: [
          { id: 'a', text: 'Компонент без шаблону', isCorrect: false },
          { id: 'b', text: 'Компонент, який не потребує NgModule', isCorrect: true },
          { id: 'c', text: 'Компонент без стилів', isCorrect: false },
          { id: 'd', text: 'Компонент для серверу', isCorrect: false }
        ],
        explanation: 'Standalone компоненти (Angular 14+) не потребують NgModule і є самодостатніми, що спрощує архітектуру додатку.',
        points: 15
      },
      {
        id: 'q1-4',
        text: 'Які переваги має Angular? (виберіть всі правильні)',
        type: 'multiple',
        options: [
          { id: 'a', text: 'TypeScript з статичною типізацією', isCorrect: true },
          { id: 'b', text: 'Компонентна архітектура', isCorrect: true },
          { id: 'c', text: 'Не потребує Node.js', isCorrect: false },
          { id: 'd', text: 'Вбудований Dependency Injection', isCorrect: true }
        ],
        explanation: 'Angular надає TypeScript, компонентну архітектуру та DI. Node.js потрібен для розробки, але не для запуску в браузері.',
        points: 15
      }
    ]
  },
  {
    id: 'quiz-2',
    lessonId: 'lesson-2',
    title: 'Компоненти та шаблони',
    questions: [
      {
        id: 'q2-1',
        text: 'Для чого використовується декоратор @Input()?',
        type: 'single',
        options: [
          { id: 'a', text: 'Для відправки даних від дочірнього до батьківського', isCorrect: false },
          { id: 'b', text: 'Для отримання даних від батьківського компонента', isCorrect: true },
          { id: 'c', text: 'Для створення форми', isCorrect: false },
          { id: 'd', text: 'Для роботи з API', isCorrect: false }
        ],
        explanation: '@Input() дозволяє компоненту отримувати дані від батьківського компонента через property binding.',
        points: 10
      },
      {
        id: 'q2-2',
        text: 'Який lifecycle hook викликається після ініціалізації компонента?',
        type: 'single',
        options: [
          { id: 'a', text: 'ngOnDestroy()', isCorrect: false },
          { id: 'b', text: 'ngOnInit()', isCorrect: true },
          { id: 'c', text: 'ngOnChanges()', isCorrect: false },
          { id: 'd', text: 'constructor()', isCorrect: false }
        ],
        explanation: 'ngOnInit() викликається один раз після першої перевірки @Input властивостей і є ідеальним місцем для ініціалізації логіки.',
        points: 15
      },
      {
        id: 'q2-3',
        text: 'Які типи data binding існують в Angular? (виберіть всі)',
        type: 'multiple',
        options: [
          { id: 'a', text: 'Інтерполяція {{ }}', isCorrect: true },
          { id: 'b', text: 'Property binding [property]', isCorrect: true },
          { id: 'c', text: 'Event binding (event)', isCorrect: true },
          { id: 'd', text: 'Style binding <style>', isCorrect: false }
        ],
        explanation: 'Angular підтримує інтерполяцію, property binding, event binding та two-way binding [(ngModel)].',
        points: 15
      }
    ]
  },
  {
    id: 'quiz-3',
    lessonId: 'lesson-4',
    title: 'Сервіси та Dependency Injection',
    questions: [
      {
        id: 'q3-1',
        text: 'Для чого використовується декоратор @Injectable()?',
        type: 'single',
        options: [
          { id: 'a', text: 'Для створення компонента', isCorrect: false },
          { id: 'b', text: 'Для позначення класу як сервісу', isCorrect: true },
          { id: 'c', text: 'Для маршрутизації', isCorrect: false },
          { id: 'd', text: 'Для створення директиви', isCorrect: false }
        ],
        explanation: '@Injectable() позначає клас як сервіс, який може бути впроваджений через Dependency Injection систему Angular.',
        points: 10
      },
      {
        id: 'q3-2',
        text: 'Який новий спосіб впровадження залежностей з\'явився в Angular 14+?',
        type: 'single',
        options: [
          { id: 'a', text: 'constructor injection', isCorrect: false },
          { id: 'b', text: 'inject() функція', isCorrect: true },
          { id: 'c', text: 'require()', isCorrect: false },
          { id: 'd', text: 'import statement', isCorrect: false }
        ],
        explanation: 'Функція inject() — це новий functional API для впровадження залежностей, який є альтернативою constructor injection.',
        points: 15
      }
    ]
  }
];
