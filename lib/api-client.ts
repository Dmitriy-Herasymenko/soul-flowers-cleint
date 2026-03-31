import { ApiErrorType, ERROR_MESSAGES, HttpStatusCode } from './api-error-types';
import { getToken } from './api-interceptor';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://soul-flowers-api.vercel.app/api';

/**
 * Базовий клас помилки API
 */
export class ApiError extends Error {
  type: ApiErrorType;
  status?: number;
  details?: Record<string, string[]>;

  constructor(
    message: string,
    type: ApiErrorType = ApiErrorType.UNKNOWN,
    status?: number,
    details?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
    this.status = status;
    this.details = details;
  }

  /**
   * Отримати повідомлення про помилку
   */
  getMessage(): string {
    // Якщо є деталі валідації, повертаємо їх
    if (this.details && Object.keys(this.details).length > 0) {
      const messages = Object.values(this.details).flat();
      return messages.join('\n');
    }
    return this.message || ERROR_MESSAGES[this.type];
  }
}

/**
 * Визначити тип помилки за статус кодом
 */
function getErrorType(status: number): ApiErrorType {
  switch (status) {
    case HttpStatusCode.BAD_REQUEST:
      return ApiErrorType.VALIDATION;
    case HttpStatusCode.UNAUTHORIZED:
      return ApiErrorType.UNAUTHORIZED;
    case HttpStatusCode.FORBIDDEN:
      return ApiErrorType.FORBIDDEN;
    case HttpStatusCode.NOT_FOUND:
      return ApiErrorType.NOT_FOUND;
    case HttpStatusCode.INTERNAL_SERVER_ERROR:
      return ApiErrorType.SERVER_ERROR;
    default:
      return ApiErrorType.UNKNOWN;
  }
}

/**
 * Обробити відповідь від API
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: { error?: { message?: string; details?: Record<string, string[]> } } = {};
    
    try {
      errorData = await response.json();
    } catch {
      // Не вдалося розпарсити JSON
    }

    const errorType = getErrorType(response.status);
    const message = errorData.error?.message || ERROR_MESSAGES[errorType];
    const details = errorData.error?.details;

    throw new ApiError(message, errorType, response.status, details);
  }

  const data = await response.json();
  
  if (!data.success) {
    throw new ApiError(
      data.error?.message || 'Запит не вдався',
      ApiErrorType.UNKNOWN,
      response.status,
      data.error?.details
    );
  }

  return data.data;
}

/**
 * Отримати заголовки для запиту
 */
function getHeaders(includeAuth: boolean = true): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

/**
 * API клієнт з обробкою помилок
 */
export const apiClient = {
  /**
   * GET запит
   */
  async get<T>(endpoint: string, includeAuth: boolean = false): Promise<T> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: getHeaders(includeAuth),
      });
      return handleResponse<T>(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError(
          ERROR_MESSAGES[ApiErrorType.NETWORK_ERROR],
          ApiErrorType.NETWORK_ERROR
        );
      }
      throw error;
    }
  },

  /**
   * POST запит
   */
  async post<T>(endpoint: string, data?: unknown, includeAuth: boolean = true): Promise<T> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(includeAuth),
        body: data ? JSON.stringify(data) : undefined,
      });
      return handleResponse<T>(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError(
          ERROR_MESSAGES[ApiErrorType.NETWORK_ERROR],
          ApiErrorType.NETWORK_ERROR
        );
      }
      throw error;
    }
  },

  /**
   * PUT запит
   */
  async put<T>(endpoint: string, data?: unknown, includeAuth: boolean = true): Promise<T> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: getHeaders(includeAuth),
        body: data ? JSON.stringify(data) : undefined,
      });
      return handleResponse<T>(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError(
          ERROR_MESSAGES[ApiErrorType.NETWORK_ERROR],
          ApiErrorType.NETWORK_ERROR
        );
      }
      throw error;
    }
  },

  /**
   * PATCH запит
   */
  async patch<T>(endpoint: string, data?: unknown, includeAuth: boolean = true): Promise<T> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PATCH',
        headers: getHeaders(includeAuth),
        body: data ? JSON.stringify(data) : undefined,
      });
      return handleResponse<T>(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError(
          ERROR_MESSAGES[ApiErrorType.NETWORK_ERROR],
          ApiErrorType.NETWORK_ERROR
        );
      }
      throw error;
    }
  },

  /**
   * DELETE запит
   */
  async delete<T>(endpoint: string, includeAuth: boolean = true): Promise<T> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: getHeaders(includeAuth),
      });
      return handleResponse<T>(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError(
          ERROR_MESSAGES[ApiErrorType.NETWORK_ERROR],
          ApiErrorType.NETWORK_ERROR
        );
      }
      throw error;
    }
  },
};
