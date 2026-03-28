// Token Interceptor - обробка 401/403 помилок та refresh токена

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://soul-flowers-api.vercel.app/api';

// Прапор щоб уникнути нескінченних циклів refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  operation: () => Promise<unknown>;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Отримати токен з localStorage
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

// Зберегти токен в localStorage
function setToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
}

// Отримати користувача з localStorage
function getUser(): unknown | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('auth_user');
  return userStr ? JSON.parse(userStr) : null;
}

// Зберегти користувача в localStorage
function setUser(user: unknown | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem('auth_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('auth_user');
  }
}

// Logout helper
function doLogout(): void {
  setToken(null);
  setUser(null);
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login';
  }
}

// Refresh token endpoint
async function refreshAccessToken(): Promise<string> {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Для cookie з refresh token
  });

  if (!response.ok) {
    throw new Error('Token refresh failed');
  }

  const data = await response.json();
  return data.data.accessToken;
}

// Базовий fetch з обробкою помилок
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Додаємо токен якщо є
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // 401 - Unauthorized (токен недійсний)
    if (response.status === 401) {
      // Якщо токен не дійсний і ми не в процесі refresh
      if (!isRefreshing) {
        isRefreshing = true;
        
        try {
          // Спробуємо оновити токен
          const newToken = await refreshAccessToken();
          setToken(newToken);
          
          // Оновлюємо користувача
          const userResponse = await fetch(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${newToken}` },
          });
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser(userData.data);
          }
          
          // Обробляємо чергу запитів
          processQueue(null, newToken);
          
          // Повторюємо оригінальний запит з новим токеном
          const newHeaders = {
            ...headers,
            Authorization: `Bearer ${newToken}`,
          };
          
          const retryResponse = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: newHeaders,
          });
          
          if (!retryResponse.ok) {
            throw new Error(`HTTP error! status: ${retryResponse.status}`);
          }
          
          return retryResponse.json();
        } catch (refreshError) {
          // Refresh не вдався - logout
          processQueue(refreshError as Error, null);
          doLogout();
          throw refreshError;
        } finally {
          isRefreshing = false;
        }
      } else {
        // Якщо вже йде refresh - додаємо в чергу
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              // Повторити запит з новим токеном
              const newHeaders = {
                ...headers,
                Authorization: `Bearer ${token}`,
              };
              fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers: newHeaders,
              })
                .then((res) => res.json())
                .then(resolve)
                .catch(reject);
            },
            reject,
            operation: () => apiRequest(endpoint, options),
          });
        });
      }
    }

    // 403 - Forbidden (немає прав доступу)
    if (response.status === 403) {
      const errorData = await response.json().catch(() => ({}));
      // Redirect на login або dashboard
      doLogout();
      throw new Error(errorData.message || 'Немає прав доступу');
    }

    // Інші помилки
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    // Мережеві помилки
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Немає з\'єднання з сервером');
    }
    throw error;
  }
}

// Helper функції для експорту
export function getAuthHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export { getToken, setToken, getUser, setUser, doLogout };
