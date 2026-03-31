/**
 * Типи помилок API
 */
export enum ApiErrorType {
  /** Помилка валідації даних */
  VALIDATION = 'VALIDATION',
  /** Користувач не авторизований */
  UNAUTHORIZED = 'UNAUTHORIZED',
  /** Недостатньо прав доступу */
  FORBIDDEN = 'FORBIDDEN',
  /** Ресурс не знайдено */
  NOT_FOUND = 'NOT_FOUND',
  /** Помилка сервера */
  SERVER_ERROR = 'SERVER_ERROR',
  /** Мережева помилка */
  NETWORK_ERROR = 'NETWORK_ERROR',
  /** Загальна помилка */
  UNKNOWN = 'UNKNOWN',
}

/**
 * HTTP статус коди
 */
export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

/**
 * Повідомлення про помилки за замовчуванням
 */
export const ERROR_MESSAGES: Record<ApiErrorType, string> = {
  [ApiErrorType.VALIDATION]: 'Помилка валідації даних. Перевірте введені дані.',
  [ApiErrorType.UNAUTHORIZED]: 'Ви не авторизовані. Будь ласка, увійдіть в систему.',
  [ApiErrorType.FORBIDDEN]: 'У вас немає прав для виконання цієї дії.',
  [ApiErrorType.NOT_FOUND]: 'Запитуваний ресурс не знайдено.',
  [ApiErrorType.SERVER_ERROR]: 'Помилка сервера. Спробуйте пізніше.',
  [ApiErrorType.NETWORK_ERROR]: 'Помилка мережі. Перевірте підключення до інтернету.',
  [ApiErrorType.UNKNOWN]: 'Сталася невідома помилка. Спробуйте пізніше.',
};
