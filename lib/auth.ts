import { apiRequest, setToken, setUser, doLogout } from './api-interceptor';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://soul-flowers-api.vercel.app/api';

interface AuthResponse {
  user: {
    id: string;
    email: string;
    roles: string[];
  };
  accessToken: string;
}

// Auth endpoints
export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Помилка входу');
  }
  
  // Зберігаємо токен і користувача
  setToken(data.data.accessToken);
  setUser(data.data.user);
  
  return data.data;
}

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Помилка реєстрації');
  }
  
  // Зберігаємо токен і користувача
  setToken(data.data.accessToken);
  setUser(data.data.user);
  
  return data.data;
}

export async function logout() {
  try {
    // Спробуємо викликати logout endpoint
    await apiRequest('/auth/logout', { method: 'POST' });
  } catch {
    // Ігноруємо помилки logout
  } finally {
    doLogout();
  }
}

export async function getCurrentUser() {
  try {
    const data: unknown = await apiRequest('/auth/me');
    return (data as { data?: unknown })?.data || null;
  } catch {
    return null;
  }
}
