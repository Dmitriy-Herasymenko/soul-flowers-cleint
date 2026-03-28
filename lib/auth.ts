const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://soul-flowers-api.vercel.app/api';

// Token interceptor - додає токен до всіх запитів
function getAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') return {};
  
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Auth endpoints
export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Помилка входу');
  }
  
  // Зберігаємо токен в localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', data.data.accessToken);
    localStorage.setItem('auth_user', JSON.stringify(data.data.user));
  }
  
  return data.data;
}

export async function register(name: string, email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Помилка реєстрації');
  }
  
  // Зберігаємо токен в localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', data.data.accessToken);
    localStorage.setItem('auth_user', JSON.stringify(data.data.user));
  }
  
  return data.data;
}

export async function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }
}

export async function getCurrentUser() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  
  if (!token) return null;
  
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (!response.ok) {
      logout();
      return null;
    }
    
    const data = await response.json();
    return data.data;
  } catch {
    return null;
  }
}

// Export auth headers helper для інших API запитів
export { getAuthHeaders };
